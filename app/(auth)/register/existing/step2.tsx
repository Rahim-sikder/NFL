import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useTheme } from '../../../theme/ThemeProvider';
import { StepIndicator } from '../../../components/ui/StepIndicator';

// Validation schema
const accountSchema = z.object({
  accountNo: z.string().min(1, "Account number is required"),
  dob: z.string().min(1, "Date of birth is required")
});

type AccountFormData = z.infer<typeof accountSchema>;

export default function ExistingCustomerStep2() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AccountFormData>({
    defaultValues: {
      accountNo: '',
      dob: ''
    }
  });

  const handleNext = async (data: AccountFormData) => {
    try {
      setIsLoading(true);
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      router.push('/register/existing/step3');
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = form.formState.isValid && form.watch('accountNo') && form.watch('dob');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <StepIndicator currentStep={2} totalSteps={3} title="Verify Account & DOB" />
      
      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Account Number</Text>
          <Controller
            control={form.control}
            name="accountNo"
            rules={{
              required: "Account number is required",
              minLength: {
                value: 1,
                message: "Account number is required"
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
                  placeholder="Enter your account number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="default"
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
          <Text style={[styles.label, { color: colors.textPrimary }]}>Date of Birth</Text>
          <Controller
            control={form.control}
            name="dob"
            rules={{
              required: "Date of birth is required",
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: "Please use YYYY-MM-DD format"
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
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
                  maxLength={10}
                />
                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                  Format: YYYY-MM-DD (e.g., 1990-01-15)
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
        
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isFormValid ? colors.primary : colors.border,
              opacity: isLoading ? 0.7 : 1
            }
          ]}
          onPress={form.handleSubmit(handleNext)}
          disabled={!isFormValid || isLoading}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>
            {isLoading ? 'Validating...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
});