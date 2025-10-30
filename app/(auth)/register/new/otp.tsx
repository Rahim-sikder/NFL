import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../../../theme/ThemeProvider';
import { sendOTP, verifyOTP } from '../../../../lib/api';

// Validation schema
const mobileSchema = z.object({
  msisdn: z.string().regex(/^(\+?88)?0?\d{11,13}$/, "Invalid BD mobile number")
});

const otpSchema = z.object({
  code: z.string().min(1, "OTP is required").max(4, "OTP must be 4 digits")
});

type MobileFormData = z.infer<typeof mobileSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export default function NewCustomerOTPVerification() {
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
    mode: 'onChange',
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
    setIsLoading(true);
    try {
      // For now, just navigate to the eKYC verification page
      // In production, you would verify the OTP here
      router.push('/register/new/ekyc');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
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

  const handleBack = () => {
    if (step === 'otp') {
      setStep('mobile');
      setOtpRef('');
      setTimer(0);
      otpForm.reset();
    } else {
      router.back();
    }
  };

  const isOTPValid = true; // Always allow verification regardless of input

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.pageTitle, { color: colors.primaryNavy2 }]}>
        New Customer Registration
      </Text>
      
      <View style={styles.form}>
        {step === 'mobile' ? (
          <>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Mobile Number</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Enter your mobile number to receive a verification code
            </Text>
            
            <Controller
              control={mobileForm.control}
              name="msisdn"
              rules={{
                required: 'Mobile number is required',
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
                        borderColor: error ? colors.error : colors.border,
                        backgroundColor: colors.inputBackground,
                        color: colors.textPrimary
                      }
                    ]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter mobile number"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="phone-pad"
                    maxLength={14}
                  />
                  {error && (
                    <Text style={[styles.errorText, { color: colors.error }]}>
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
                  backgroundColor: mobileForm.formState.isValid ? colors.primary : colors.border,
                }
              ]}
              onPress={mobileForm.handleSubmit(handleSendOTP)}
              disabled={!mobileForm.formState.isValid || isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Enter OTP</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              We've sent a 4-digit code to {msisdnValue}
            </Text>
            
            <Controller
              control={otpForm.control}
              name="code"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.otpInput,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.inputBackground,
                      color: colors.textPrimary
                    }
                  ]}
                  value={value || ''}
                  onChangeText={(text) => {
                    // Allow only numeric input and limit to 4 digits
                    const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
                    onChange(numericText);
                  }}
                  placeholder="0000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={4}
                  textAlign="center"
                  editable={true}
                  autoFocus={true}
                  selectTextOnFocus={true}
                  clearTextOnFocus={true}
                />
              )}
            />
            
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isOTPValid ? colors.primary : colors.border,
                }
              ]}
              onPress={otpForm.handleSubmit(handleVerifyOTP)}
              disabled={!isOTPValid || isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
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
          </>
        )}
      </View>
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
    letterSpacing: 4,
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