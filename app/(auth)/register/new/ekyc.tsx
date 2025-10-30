import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../../../theme/ThemeProvider';

// Validation schema
const ekycSchema = z.object({
  nid: z.string().min(10, "NID number is required").max(17, "NID number should not exceed 17 digits"),
  fullName: z.string().min(2, "Full name is required"),
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date format should be YYYY-MM-DD"),
  divisionName: z.string().min(1, "Division is required"),
  districtName: z.string().min(1, "District is required"),
  upazilaName: z.string().min(1, "Upazila is required"),
  postCode: z.string().min(4, "Post code is required"),
  addressLine: z.string().min(5, "Address line is required"),
  email: z.string().email("Valid email address required"),
  agreeConsent: z.boolean().refine(val => val === true, "You must confirm the information is accurate")
});

type EKYCFormData = z.infer<typeof ekycSchema>;

interface ImageData {
  uri: string;
  type: string;
  name: string;
}

export default function EKYCVerification() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [nidFront, setNidFront] = useState<ImageData | null>(null);
  const [nidBack, setNidBack] = useState<ImageData | null>(null);
  const [liveSelfie, setLiveSelfie] = useState<ImageData | null>(null);

  const form = useForm<EKYCFormData>({
    resolver: zodResolver(ekycSchema),
    mode: 'onChange',
    defaultValues: {
      nid: '',
      fullName: '',
      fatherName: '',
      motherName: '',
      dob: '',
      divisionName: '',
      districtName: '',
      upazilaName: '',
      postCode: '',
      addressLine: '',
      email: '',
      agreeConsent: false
    }
  });

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted' || cameraStatus.status !== 'granted') {
      Alert.alert('Permission Required', 'Camera and photo library access is required for e-KYC verification.');
      return false;
    }
    return true;
  };

  const pickImage = async (type: 'nid-front' | 'nid-back' | 'selfie') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'selfie' ? [1, 1] : [4, 3],
      quality: 0.8,
    };

    Alert.alert(
      'Select Image',
      'Choose how you want to add the image',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync(options);
            if (!result.canceled && result.assets[0]) {
              const imageData = {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: `${type}-${Date.now()}.jpg`
              };
              setImageData(type, imageData);
            }
          }
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.canceled && result.assets[0]) {
              const imageData = {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: `${type}-${Date.now()}.jpg`
              };
              setImageData(type, imageData);
            }
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const setImageData = (type: 'nid-front' | 'nid-back' | 'selfie', imageData: ImageData) => {
    switch (type) {
      case 'nid-front':
        setNidFront(imageData);
        break;
      case 'nid-back':
        setNidBack(imageData);
        break;
      case 'selfie':
        setLiveSelfie(imageData);
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Navigate to User ID and Password Creation page
      router.push('/register/new/credentials');
    } catch (error) {
      Alert.alert('Error', 'Failed to proceed to registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the isFormValid check since button should always be active

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.pageTitle, { color: colors.primaryNavy2 }]}>
        e-KYC Verification
      </Text>
      
      {/* Image Capture Section */}
      <View style={styles.imageSection}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Document Images</Text>
        
        {/* NID Front */}
        <View style={styles.imageContainer}>
          <Text style={[styles.imageLabel, { color: colors.textPrimary }]}>NID Front</Text>
          <TouchableOpacity
            style={[styles.imageButton, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => pickImage('nid-front')}
          >
            {nidFront ? (
              <Image source={{ uri: nidFront.uri }} style={styles.previewImage} />
            ) : (
              <Text style={[styles.imageButtonText, { color: colors.onSurface }]}>📷 Capture NID Front</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* NID Back */}
        <View style={styles.imageContainer}>
          <Text style={[styles.imageLabel, { color: colors.textPrimary }]}>NID Back</Text>
          <TouchableOpacity
            style={[styles.imageButton, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => pickImage('nid-back')}
          >
            {nidBack ? (
              <Image source={{ uri: nidBack.uri }} style={styles.previewImage} />
            ) : (
              <Text style={[styles.imageButtonText, { color: colors.onSurface }]}>📷 Capture NID Back</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Live Selfie */}
        <View style={styles.imageContainer}>
          <Text style={[styles.imageLabel, { color: colors.textPrimary }]}>Live Selfie</Text>
          <TouchableOpacity
            style={[styles.imageButton, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => pickImage('selfie')}
          >
            {liveSelfie ? (
              <Image source={{ uri: liveSelfie.uri }} style={styles.previewImage} />
            ) : (
              <Text style={[styles.imageButtonText, { color: colors.textSecondary }]}>🤳 Take Live Selfie</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Personal Information</Text>
        
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>NID</Text>
          <Controller
            control={form.control}
            name="nid"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your NID number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Full Name</Text>
          <Controller
            control={form.control}
            name="fullName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textSecondary}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Father's Name</Text>
          <Controller
            control={form.control}
            name="fatherName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter father's name"
                  placeholderTextColor={colors.textSecondary}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Mother's Name</Text>
          <Controller
            control={form.control}
            name="motherName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter mother's name"
                  placeholderTextColor={colors.textSecondary}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Date of Birth</Text>
          <Controller
            control={form.control}
            name="dob"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Address Information */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Address Information</Text>
        
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Division Name</Text>
          <Controller
            control={form.control}
            name="divisionName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: error ? colors.error || '#ff4444' : colors.border,
                  }
                ]}>
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={onChange}
                    style={[styles.picker, { color: colors.textPrimary }]}
                  >
                    <Picker.Item label="Select division" value="" />
                    <Picker.Item label="Barisal" value="Barisal" />
                    <Picker.Item label="Chittagong" value="Chittagong" />
                    <Picker.Item label="Dhaka" value="Dhaka" />
                    <Picker.Item label="Khulna" value="Khulna" />
                    <Picker.Item label="Mymensingh" value="Mymensingh" />
                    <Picker.Item label="Rajshahi" value="Rajshahi" />
                    <Picker.Item label="Rangpur" value="Rangpur" />
                    <Picker.Item label="Sylhet" value="Sylhet" />
                  </Picker>
                </View>
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>District Name</Text>
          <Controller
            control={form.control}
            name="districtName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: error ? colors.error || '#ff4444' : colors.border,
                  }
                ]}>
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={onChange}
                    style={[styles.picker, { color: colors.textPrimary }]}
                  >
                    <Picker.Item label="Select district" value="" />
                    <Picker.Item label="Dhaka" value="Dhaka" />
                    <Picker.Item label="Khulna" value="Khulna" />
                    <Picker.Item label="Chattogram" value="Chattogram" />
                    <Picker.Item label="Brahmanbaria" value="Brahmanbaria" />
                    <Picker.Item label="Rajshahi" value="Rajshahi" />
                    <Picker.Item label="Rangpur" value="Rangpur" />
                    <Picker.Item label="Noakhali" value="Noakhali" />
                    <Picker.Item label="Naogaon" value="Naogaon" />
                    <Picker.Item label="Bandarban" value="Bandarban" />
                    <Picker.Item label="Cox's Bazar" value="Cox's Bazar" />
                  </Picker>
                </View>
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Upazila Name</Text>
          <Controller
            control={form.control}
            name="upazilaName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: error ? colors.error || '#ff4444' : colors.border,
                  }
                ]}>
                  <Picker
                    selectedValue={value || ''}
                    onValueChange={onChange}
                    style={[styles.picker, { color: colors.textPrimary }]}
                  >
                    <Picker.Item label="Select upazila" value="" />
                    <Picker.Item label="Amtali" value="Amtali" />
                    <Picker.Item label="Bamna" value="Bamna" />
                    <Picker.Item label="Betagi" value="Betagi" />
                    <Picker.Item label="Taltali" value="Taltali" />
                    <Picker.Item label="Babuganj" value="Babuganj" />
                    <Picker.Item label="Gouranadi" value="Gouranadi" />
                    <Picker.Item label="Hizla" value="Hizla" />
                    <Picker.Item label="Uzirpur" value="Uzirpur" />
                    <Picker.Item label="Daulatkhan" value="Daulatkhan" />
                    <Picker.Item label="Lalmohan" value="Lalmohan" />
                    <Picker.Item label="Rajapur" value="Rajapur" />
                  </Picker>
                </View>
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Post Code</Text>
          <Controller
            control={form.control}
            name="postCode"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter post code"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Address Line</Text>
          <Controller
            control={form.control}
            name="addressLine"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your address line"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={2}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Email Address</Text>
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your email address"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>

        {/* Consent Checkbox */}
        <View style={styles.checkboxContainer}>
          <Controller
            control={form.control}
            name="agreeConsent"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => onChange(!value)}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      backgroundColor: value ? colors.primary : colors.card
                    }
                  ]}>
                    {value && (
                      <Text style={[styles.checkmark, { color: colors.white }]}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.checkboxText, { color: colors.textPrimary }]}>
                    I confirm that the above information is accurate.
                  </Text>
                </TouchableOpacity>
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: isLoading ? 0.7 : 1
            }
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            {isLoading ? 'Processing...' : 'Continue to Registration'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  pageTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  imageSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  imageButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  form: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});