import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useTheme } from '../../../theme/ThemeProvider';
import { StepIndicator } from '../../../components/ui/StepIndicator';
import { registerExisting } from '../../../../lib/api';

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

export default function ExistingCustomerStep3() {
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
      
      // Mock data for registration
      const registrationData = {
        msisdn: '+8801234567890', // This would come from previous steps
        accountNo: 'ACC123456789', // This would come from step 2
        dob: '1990-01-01', // This would come from step 2
        userId: data.userId,
        password: data.password
      };
      
      const response = await registerExisting(registrationData);
      
      if (response.ok) {
        // Show confirmation modal instead of alert
        setShowConfirmationModal(true);
      }
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
      <StepIndicator currentStep={3} totalSteps={3} title="Create User" />
      
      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>User ID</Text>
          <Controller
            control={form.control}
            name="userId"
            rules={{
              validate: (value) => {
                try {
                  credentialsSchema.shape.userId.parse(value);
                  return true;
                } catch (error: any) {
                  return error.errors?.[0]?.message || "Invalid User ID";
                }
              }
            }}
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
                  placeholder="Enter user ID (8-20 characters)"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                  8-20 characters, letters, numbers, dots, underscores, hyphens only
                </Text>
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
            rules={{
              validate: (value) => {
                try {
                  credentialsSchema.shape.password.parse(value);
                  return true;
                } catch (error: any) {
                  return error.errors?.[0]?.message || "Invalid password";
                }
              }
            }}
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
                    placeholder="Enter password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
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
                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                  Min 8 chars, 1 uppercase, 1 lowercase, 1 digit
                </Text>
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
            rules={{
              validate: (value) => {
                const password = form.getValues('password');
                if (value !== password) {
                  return "Passwords don't match";
                }
                return true;
              }
            }}
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
                    placeholder="Confirm password"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
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
                    I agree to{' '}
                    <Text style={[styles.linkText, { color: colors.primary }]}>
                      Terms & Privacy Policy
                    </Text>
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

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleConfirmationClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Account Created Successfully!
            </Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
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
  form: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  eyeText: {
    fontSize: 18,
  },
  helperText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 4,
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
  linkText: {
    fontFamily: 'Poppins_600SemiBold',
    textDecorationLine: 'underline',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
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
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});