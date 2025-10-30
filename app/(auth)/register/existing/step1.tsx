import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useTheme } from '../../../theme/ThemeProvider';
import { StepIndicator } from '../../../components/ui/StepIndicator';
import { sendOTP, verifyOTP } from '../../../../lib/api';

// Validation schema
const mobileSchema = z.object({
  msisdn: z.string().regex(/^(\+?88)?0?\d{11,13}$/, "Invalid BD mobile number")
});

const otpSchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits")
});

type MobileFormData = z.infer<typeof mobileSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function ExistingCustomerStep1() {
  const { colors } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [otpRef, setOtpRef] = useState<string>('');
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [msisdnValue, setMsisdnValue] = useState('');

  // Mobile form
  const mobileForm = useForm<MobileFormData>({
    defaultValues: { msisdn: '' }
  });

  // OTP form
  const otpForm = useForm<OTPFormData>({
    defaultValues: { code: '' }
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async (data: MobileFormData) => {
    try {
      setIsLoading(true);
      const response = await sendOTP({ msisdn: data.msisdn });
      if (response.ok) {
        setOtpRef(response.ref);
        setMsisdnValue(data.msisdn);
        setStep('otp');
        setTimer(60);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data: OTPFormData) => {
    try {
      setIsLoading(true);
      const response = await verifyOTP({
        msisdn: msisdnValue,
        code: data.code,
        ref: otpRef
      });
      if (response.ok) {
        router.push('/(auth)/register/existing/step3');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    try {
      setIsLoading(true);
      const response = await sendOTP({ msisdn: msisdnValue });
      if (response.ok) {
        setOtpRef(response.ref);
        setTimer(60);
        Alert.alert('Success', 'OTP sent successfully');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const isMobileValid = mobileForm.formState.isValid && mobileForm.watch('msisdn');
  const isOTPValid = otpForm.formState.isValid && otpForm.watch('code');

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <StepIndicator currentStep={1} totalSteps={3} title="Mobile Verification" />
      
      {step === 'mobile' ? (
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Mobile Number</Text>
          <Controller
            control={mobileForm.control}
            name="msisdn"
            rules={{
              validate: (value) => {
                try {
                  mobileSchema.parse({ msisdn: value });
                  return true;
                } catch {
                  return "Invalid BD mobile number";
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
                  placeholder="Enter your mobile number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  maxLength={14}
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isMobileValid ? colors.primary : colors.border,
                opacity: isLoading ? 0.7 : 1
              }
            ]}
            onPress={mobileForm.handleSubmit(handleSendOTP)}
            disabled={!isMobileValid || isLoading}
          >
            <Text style={[styles.buttonText, { color: colors.white }]}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Enter OTP</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            We've sent a 6-digit code to {msisdnValue}
          </Text>
          
          <Controller
            control={otpForm.control}
            name="code"
            rules={{
              validate: (value) => {
                try {
                  otpSchema.parse({ code: value });
                  return true;
                } catch {
                  return "OTP must be 6 digits";
                }
              }
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  style={[
                    styles.input,
                    styles.otpInput,
                    {
                      backgroundColor: colors.card,
                      borderColor: error ? colors.error || '#ff4444' : colors.border,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder="000000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                />
                {error && (
                  <Text style={[styles.errorText, { color: colors.error || '#ff4444' }]}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isOTPValid ? colors.primary : colors.border,
                opacity: isLoading ? 0.7 : 1
              }
            ]}
            onPress={otpForm.handleSubmit(handleVerifyOTP)}
            disabled={!isOTPValid || isLoading}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOTP}
            disabled={timer > 0 || isLoading}
          >
            <Text style={[styles.resendText, { color: timer > 0 ? colors.textSecondary : colors.primary }]}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  label: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  otpInput: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 8,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 16,
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
  resendButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  resendText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
});