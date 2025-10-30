import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { pickImageOrDoc, FileMeta, formatFileSize } from '../../../lib/file';

interface FileUploadProps {
  label: string;
  name: string;
  accept: string[];
  required?: boolean;
  value?: FileMeta;
  onChange: (file: FileMeta | null) => void;
  error?: string;
}

function FileUpload({ label, name, accept, required, value, onChange, error }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handlePickFile = async () => {
    setIsUploading(true);
    try {
      const file = await pickImageOrDoc(accept);
      onChange(file);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  const isImage = value && value.type.startsWith('image/');

  return (
    <View style={styles.fileUploadContainer}>
      <Text style={styles.fileLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      {value ? (
        <View style={styles.filePreview}>
          {isImage ? (
            <Image source={{ uri: value.uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.fileBadge}>
              <Text style={styles.fileBadgeText}>📄</Text>
              <Text style={styles.fileName} numberOfLines={1}>{value.name}</Text>
            </View>
          )}
          
          <View style={styles.fileInfo}>
            <Text style={styles.fileInfoText}>{value.name}</Text>
            <Text style={styles.fileSize}>{formatFileSize(value.size)}</Text>
          </View>
          
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFile}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.uploadButton, error && styles.uploadButtonError]} 
          onPress={handlePickFile}
          disabled={isUploading}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Uploading...' : `Choose ${accept.includes('image/*') ? 'Image' : 'File'}`}
          </Text>
        </TouchableOpacity>
      )}
      
      {error && (value || !error.includes('File must be')) && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

interface ApplicantInfoStepProps {
  formData: any;
  currentStepData: any;
  isReviewMode?: boolean;
  onNext?: (data: any) => void;
}

export default function ApplicantInfoStep({ formData, currentStepData, isReviewMode, onNext }: ApplicantInfoStepProps) {
  const { control, formState: { errors }, handleSubmit } = useFormContext();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Account Name <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="accountName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, errors.accountName && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter full name"
                maxLength={80}
              />
            )}
          />
          {errors.accountName && (
            <Text style={styles.errorText}>{errors.accountName.message as string}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, errors.email && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter email address (optional)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message as string}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Mailing Address <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="mailingAddress"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textArea, errors.mailingAddress && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter complete mailing address"
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            )}
          />
          {errors.mailingAddress && (
            <Text style={styles.errorText}>{errors.mailingAddress.message as string}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Documents</Text>
        
        <Controller
          control={control}
          name="nidDoc"
          render={({ field: { onChange, value } }) => (
            <FileUpload
              label="NID/Passport/Birth Certificate"
              name="nidDoc"
              accept={['image/*', 'application/pdf']}
              required
              value={value}
              onChange={onChange}
              error={errors.nidDoc?.message as string}
            />
          )}
        />

        <Controller
          control={control}
          name="photo"
          render={({ field: { onChange, value } }) => (
            <FileUpload
              label="Photo"
              name="photo"
              accept={['image/*']}
              required
              value={value}
              onChange={onChange}
              error={errors.photo?.message as string}
            />
          )}
        />

        <Controller
          control={control}
          name="signature"
          render={({ field: { onChange, value } }) => (
            <FileUpload
              label="Signature"
              name="signature"
              accept={['image/*', 'application/pdf']}
              required
              value={value}
              onChange={onChange}
              error={errors.signature?.message as string}
            />
          )}
        />

        <Controller
          control={control}
          name="tin"
          render={({ field: { onChange, value } }) => (
            <FileUpload
              label="TIN Certificate"
              name="tin"
              accept={['image/*', 'application/pdf']}
              value={value}
              onChange={onChange}
              error={errors.tin?.message as string}
            />
          )}
        />
        
        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
           <TouchableOpacity 
             style={styles.nextButton} 
             onPress={() => {
               if (onNext) {
                 onNext({});
               }
             }}
           >
             <Text style={styles.nextButtonText}>Next</Text>
           </TouchableOpacity>
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: '#dc3545',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  fileUploadContainer: {
    marginBottom: 20,
  },
  fileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#0A2E5C',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  uploadButtonError: {
    borderColor: '#dc3545',
  },
  uploadButtonText: {
    color: '#0A2E5C',
    fontSize: 16,
    fontWeight: '500',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  fileBadge: {
    width: 50,
    height: 50,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileBadgeText: {
    fontSize: 20,
  },
  fileName: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  fileInfo: {
    flex: 1,
  },
  fileInfoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  nextButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
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