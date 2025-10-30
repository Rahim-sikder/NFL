import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useTheme } from '../../../theme/ThemeProvider';

// Validation schema
const credentialsSchema = z.object({
  userId: z.string()
    .min(8, "User ID must be at least 8 characters")
    .max(20, "User ID must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "User ID can only contain letters, numbers, dots, underscores, and hyphens"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one digit"),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, "You must agree to Terms & Privacy")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

export default function NewUserCredentials() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const form = useForm<CredentialsFormData>({
    defaultValues: {
      userId: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    }
  });

  const handleSubmit = async (data: CredentialsFormData) => {
    try {
      setIsLoading(true);
      
      // Mock data for new user registration
      const registrationData = {
        userId: data.userId,
        password: data.password,
        // e-KYC data would be retrieved from storage or context here
        timestamp: new Date().toISOString()
      };
      
      // In a real app, this would call the registration API
      console.log('New User Registration Data:', registrationData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show confirmation modal
      setShowConfirmationModal(true);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmationModal(false);
    // Navigate to login page
    router.replace('/(public)');
  };

  const isFormValid = form.formState.isValid && 
    form.watch('userId') && 
    form.watch('password') && 
    form.watch('confirmPassword') && 
    form.watch('agreeTerms');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.pageTitle, { color: colors.primaryNavy2 }]}>
        Create User ID & Password
      </Text>
      
      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>User ID</Text>
          <Controller
            control={form.control}
            name="userId"
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
                  placeholder="Enter your desired User ID"
                  placeholderTextColor={colors.textSecondary}
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

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Password</Text>
          <Controller
            control={form.control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      {
                        backgroundColor: colors.card,
                        borderColor: error ? colors.error || '#ff4444' : colors.border,
                        color: colors.textPrimary
                      }
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={[styles.eyeText, { color: colors.textSecondary }]}>
                      {showPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
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
          <Text style={[styles.label, { color: colors.textPrimary }]}>Confirm Password</Text>
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      {
                        backgroundColor: colors.card,
                        borderColor: error ? colors.error || '#ff4444' : colors.border,
                        color: colors.textPrimary
                      }
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={[styles.eyeText, { color: colors.textSecondary }]}>
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
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

        {/* Terms & Privacy Checkbox */}
        <View style={styles.checkboxContainer}>
          <Controller
            control={form.control}
            name="agreeTerms"
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
                    I agree to the Terms & Conditions and Privacy Policy
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
              backgroundColor: isFormValid ? colors.primary : colors.border,
              opacity: isLoading ? 0.7 : 1
            }
          ]}
          onPress={form.handleSubmit(handleSubmit)}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleConfirmationClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>
              🎉 Account Created Successfully!
            </Text>
            <Text style={[styles.modalText, { color: colors.textPrimary }]}>
              Your account has been created successfully. You can now log in with your credentials.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleConfirmationClose}
            >
              <Text style={[styles.modalButtonText, { color: colors.white }]}>
                Go to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  form: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  fieldContainer: {
    marginBottom: 16,
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
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeText: {
    fontSize: 16,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
  checkboxContainer: {
    marginBottom: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
  },
  modalButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
});