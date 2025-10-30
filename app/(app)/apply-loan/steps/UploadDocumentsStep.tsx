import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme/ThemeProvider';
import Icon from '../../../components/ui/Icon';

// File validation schema
const fileSchema = z.object({
  uri: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});

const documentsSchema = z.object({
  nidPassport: fileSchema.optional(),
  recentPhoto: fileSchema.optional(),
  incomeProof: fileSchema.optional(),
  vehicleProforma: fileSchema.optional(),
  propertyPapers: fileSchema.optional(),
  utilityBill: fileSchema.optional(),
  tinCertificate: fileSchema.optional(),
  bankStatement: fileSchema.optional(),
}).refine(
  (data) => data.nidPassport && data.recentPhoto && data.incomeProof,
  {
    message: 'NID/Passport, Recent Photo, and Income Proof are required',
    path: ['required'],
  }
);

type FileData = z.infer<typeof fileSchema>;
type FormData = z.infer<typeof documentsSchema>;

interface Props {
  data: Partial<FormData>;
  loanType?: string;
  onDataChange: (data: FormData, isValid: boolean) => void;
}

interface DocumentType {
  key: keyof FormData;
  label: string;
  description: string;
  required: boolean;
  acceptedTypes: string[];
  showForLoanTypes?: string[];
}

const documentTypes: DocumentType[] = [
  {
    key: 'nidPassport',
    label: 'NID/Passport',
    description: 'Clear photo of your National ID or Passport',
    required: true,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
  },
  {
    key: 'recentPhoto',
    label: 'Recent Photo',
    description: 'Recent passport-size photograph',
    required: true,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  },
  {
    key: 'incomeProof',
    label: 'Income Proof',
    description: 'Salary slip, bank statement, or trade license',
    required: true,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
  },
  {
    key: 'vehicleProforma',
    label: 'Vehicle Proforma',
    description: 'Vehicle quotation or proforma invoice',
    required: false,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
    showForLoanTypes: ['Auto'],
  },
  {
    key: 'propertyPapers',
    label: 'Property Papers',
    description: 'Property documents or deed',
    required: false,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
    showForLoanTypes: ['Home'],
  },
  {
    key: 'utilityBill',
    label: 'Utility Bill',
    description: 'Recent electricity, gas, or water bill',
    required: false,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
  },
  {
    key: 'tinCertificate',
    label: 'TIN Certificate',
    description: 'Tax Identification Number certificate',
    required: false,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
  },
  {
    key: 'bankStatement',
    label: 'Bank Statement',
    description: '3-6 months bank statement',
    required: false,
    acceptedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
  },
];

const allowedExtensions = ['png', 'jpeg', 'jpg', 'webp', 'pdf'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

export default function UploadDocumentsStep({ data, loanType, onDataChange }: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<Partial<FormData>>(data || {});

  const {
    control,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(documentsSchema),
    mode: 'onChange',
    defaultValues: data || {},
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isValid) {
      onDataChange(watchedValues, true);
    } else {
      onDataChange(watchedValues, false);
    }
  }, [watchedValues, isValid, onDataChange]);

  const validateFile = (file: any): string | null => {
    if (!file) return 'No file selected';

    // Check file size
    if (file.size > maxFileSize) {
      return 'File size must be less than 5MB';
    }

    // Check file type
    const fileExtension = file.name?.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return 'Only PNG, JPEG, JPG, WEBP, and PDF files are allowed';
    }

    return null;
  };

  const pickDocument = async (documentKey: keyof FormData) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const validationError = validateFile(file);

        if (validationError) {
          Alert.alert('Invalid File', validationError);
          return;
        }

        const fileData: FileData = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size || 0,
        };

        setValue(documentKey, fileData);
        setUploadedFiles(prev => ({ ...prev, [documentKey]: fileData }));
        trigger(documentKey);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async (documentKey: keyof FormData) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: documentKey === 'recentPhoto' ? [1, 1] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Estimate file size (rough calculation)
        const estimatedSize = (asset.width || 1000) * (asset.height || 1000) * 0.5;
        
        if (estimatedSize > maxFileSize) {
          Alert.alert('File Too Large', 'Please select a smaller image or reduce quality');
          return;
        }

        const fileData: FileData = {
          uri: asset.uri,
          name: `${documentKey}_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: estimatedSize,
        };

        setValue(documentKey, fileData);
        setUploadedFiles(prev => ({ ...prev, [documentKey]: fileData }));
        trigger(documentKey);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async (documentKey: keyof FormData) => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: documentKey === 'recentPhoto' ? [1, 1] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        const fileData: FileData = {
          uri: asset.uri,
          name: `${documentKey}_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: (asset.width || 1000) * (asset.height || 1000) * 0.5,
        };

        setValue(documentKey, fileData);
        setUploadedFiles(prev => ({ ...prev, [documentKey]: fileData }));
        trigger(documentKey);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeFile = (documentKey: keyof FormData) => {
    setValue(documentKey, undefined);
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[documentKey];
      return updated;
    });
    trigger(documentKey);
  };

  const showUploadOptions = (documentKey: keyof FormData, acceptsImages: boolean) => {
    const options = [
      { text: 'Choose from Files', onPress: () => pickDocument(documentKey) },
    ];

    if (acceptsImages) {
      options.unshift(
        { text: 'Take Photo', onPress: () => takePhoto(documentKey) },
        { text: 'Choose from Gallery', onPress: () => pickImage(documentKey) }
      );
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Upload Document', 'Choose an option:', options);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return 'Image';
    if (type === 'application/pdf') return 'FileText';
    return 'File';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDocumentUpload = (docType: DocumentType) => {
    // Check if document should be shown for this loan type
    if (docType.showForLoanTypes && loanType && !docType.showForLoanTypes.includes(loanType)) {
      return null;
    }

    const file = uploadedFiles[docType.key];
    const acceptsImages = docType.acceptedTypes.some(type => type.startsWith('image/'));
    const error = errors[docType.key];

    return (
      <View key={docType.key} style={styles.documentCard}>
        <View style={styles.documentHeader}>
          <Text style={[styles.documentLabel, { color: colors.text }]}>
            {docType.label}
            {docType.required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
          <Text style={[styles.documentDescription, { color: colors.textSecondary }]}>
            {docType.description}
          </Text>
        </View>

        {file ? (
          <View
            style={[
              styles.uploadedFile,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.fileInfo}>
              <View style={styles.fileHeader}>
                <Icon
                  icon={getFileIcon(file.type)}
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.fileDetails}>
                  <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={[styles.fileSize, { color: colors.textSecondary }]}>
                    {formatFileSize(file.size)}
                  </Text>
                </View>
              </View>
              
              {file.type.startsWith('image/') && (
                <Image source={{ uri: file.uri }} style={styles.imagePreview} />
              )}
            </View>
            
            <View style={styles.fileActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.viewButton,
                  { backgroundColor: colors.primary + '20' },
                ]}
                onPress={() => {
                  if (file.type === 'application/pdf') {
                    Linking.openURL(file.uri);
                  }
                }}
              >
                <Icon icon="Eye" size={16} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  View
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.removeButton,
                  { backgroundColor: colors.error + '20' },
                ]}
                onPress={() => removeFile(docType.key)}
              >
                <Icon icon="Trash2" size={16} color={colors.error} />
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.uploadArea,
              {
                backgroundColor: colors.background,
                borderColor: error ? colors.error : colors.border,
              },
            ]}
            onPress={() => showUploadOptions(docType.key, acceptsImages)}
          >
            <Icon
              icon="Upload"
              size={32}
              color={error ? colors.error : colors.textSecondary}
            />
            <Text style={[styles.uploadText, { color: colors.text }]}>
              Tap to upload {docType.label.toLowerCase()}
            </Text>
            <Text style={[styles.uploadHint, { color: colors.textSecondary }]}>
              PNG, JPEG, WEBP, PDF • Max 5MB
            </Text>
          </TouchableOpacity>
        )}

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error.message}
          </Text>
        )}
      </View>
    );
  };

  const requiredDocs = documentTypes.filter(doc => doc.required);
  const optionalDocs = documentTypes.filter(doc => 
    !doc.required && 
    (!doc.showForLoanTypes || (loanType && doc.showForLoanTypes.includes(loanType)))
  );
  const generalOptionalDocs = documentTypes.filter(doc => 
    !doc.required && !doc.showForLoanTypes
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Please upload the required documents. Ensure all documents are clear and readable.
        </Text>

        {/* Required Documents */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Required Documents
          </Text>
          {requiredDocs.map(renderDocumentUpload)}
        </View>

        {/* Loan Type Specific Optional Documents */}
        {optionalDocs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Additional Documents for {loanType} Loan
            </Text>
            {optionalDocs.map(renderDocumentUpload)}
          </View>
        )}

        {/* General Optional Documents */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Optional Documents
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            These documents may help speed up your application process.
          </Text>
          {generalOptionalDocs.map(renderDocumentUpload)}
        </View>

        {errors.required && (
          <Text style={[styles.errorText, styles.globalError, { color: colors.error }]}>
            {errors.required.message}
          </Text>
        )}

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => {
              // Navigate to step 6
              router.push('/apply-loan/6');
            }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 16,
  },
  documentCard: {
    marginBottom: 20,
  },
  documentHeader: {
    marginBottom: 12,
  },
  documentLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  documentDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  uploadText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  uploadHint: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  uploadedFile: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  fileInfo: {
    marginBottom: 12,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 2,
  },
  fileSize: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  imagePreview: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewButton: {
    // backgroundColor set dynamically
  },
  removeButton: {
    // backgroundColor set dynamically
  },
  actionButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 8,
  },
  globalError: {
    textAlign: 'center',
    marginTop: 16,
  },
  nextButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#f28a1b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});