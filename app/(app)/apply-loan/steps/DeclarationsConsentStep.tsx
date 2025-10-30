import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme/ThemeProvider';
import Icon from '../../../components/ui/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postLoanApply } from '../../../../lib/api';

const declarationsSchema = z.object({
  termsConditions: z.literal(true, {
    errorMap: () => ({ message: 'You must read and agree to the Terms & Conditions' }),
  }),
});

type FormData = z.infer<typeof declarationsSchema>;

interface Props {
  data: Partial<FormData>;
  onDataChange: (data: FormData, isValid: boolean) => void;
}

interface Declaration {
  key: keyof FormData;
  title: string;
  description: string;
  hasDetails?: boolean;
  detailsKey?: keyof FormData;
  detailsPlaceholder?: string;
}

const declarations: Declaration[] = [
  {
    key: 'termsConditions',
    title: 'Terms & Conditions',
    description: 'I have Read the Terms & Conditions',
  },
];



export default function DeclarationsConsentStep({ data, onDataChange }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  const {
    control,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(declarationsSchema),
    mode: 'onChange',
    defaultValues: {
      termsConditions: data.termsConditions || false,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isValid) {
      onDataChange(watchedValues, true);
    } else {
      onDataChange(watchedValues, false);
    }
  }, [watchedValues, isValid, onDataChange]);

  const openTermsAndPrivacy = (type: 'terms' | 'privacy') => {
    const url = type === 'terms' 
      ? 'https://nfl.com.bd/terms-of-service' 
      : 'https://nfl.com.bd/privacy-policy';
    Linking.openURL(url).catch(() => {
      // Handle error if URL can't be opened
    });
  };

  const renderCheckbox = (declaration: Declaration) => {
    const isChecked = watchedValues[declaration.key] === true;
    const error = errors[declaration.key];

    return (
      <View key={declaration.key} style={styles.declarationCard}>
        <Controller
          control={control}
          name={declaration.key}
          render={({ field: { onChange } }) => (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                const newValue = !isChecked;
                onChange(newValue);
              }}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isChecked ? colors.primary : 'transparent',
                    borderColor: error ? colors.error : (isChecked ? colors.primary : colors.border),
                  },
                ]}
              >
                {isChecked && (
                  <Icon icon="Check" size={16} color="#fff" />
                )}
              </View>
              
              <View style={styles.declarationContent}>
                <Text style={[styles.declarationTitle, { color: colors.text }]}>
                  {declaration.title}
                </Text>
                <Text style={[styles.declarationDescription, { color: colors.textSecondary }]}>
                  {declaration.description}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error.message}
          </Text>
        )}
      </View>
    );
  };





  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Please read and confirm the following declaration as required by Bangladesh Bank regulations.
        </Text>

        {/* Declarations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Declaration & Consent
          </Text>
          {declarations.map(renderCheckbox)}
        </View>

        {/* FATCA Section */}
        {/* Removed FATCA Declaration section */}

        {/* Digital Signature */}
        {/* Removed Digital Signature section */}

        {/* Important Notice */}
        <View
          style={[
            styles.noticeCard,
            {
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '30',
            },
          ]}
        >
          <View style={styles.noticeHeader}>
            <Icon icon="Info" size={20} color={colors.primary} />
            <Text style={[styles.noticeTitle, { color: colors.primary }]}>
              Important Notice
            </Text>
          </View>
          <Text style={[styles.noticeText, { color: colors.text }]}>
            By proceeding with this application, you acknowledge that:
          </Text>
          <Text style={[styles.noticeList, { color: colors.textSecondary }]}>
            • This is an application for a loan and not a guarantee of approval{"\n"}
            • NFL reserves the right to approve, reject, or modify loan terms{"\n"}
            • Final loan terms may differ from your application{"\n"}
            • Additional documentation may be required during processing
          </Text>
        </View>
      </View>
      </ScrollView>
      
      {/* Submit Button - Fixed at bottom */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: colors.primaryNavy2 }]} 
          onPress={async () => {
            try {
              // Collect all loan application data from AsyncStorage
              const loanDetailsData = await AsyncStorage.getItem('loanDetailsData');
              const employmentIncomeData = await AsyncStorage.getItem('employmentIncomeData');
              const paymentTermsData = await AsyncStorage.getItem('paymentTermsData');
              const uploadDocumentsData = await AsyncStorage.getItem('uploadDocumentsData');
              
              // Prepare the loan application payload
              const payload = {
                loanDetails: loanDetailsData ? JSON.parse(loanDetailsData) : {},
                employmentIncome: employmentIncomeData ? JSON.parse(employmentIncomeData) : {},
                paymentTerms: paymentTermsData ? JSON.parse(paymentTermsData) : {},
                uploadDocuments: uploadDocumentsData ? JSON.parse(uploadDocumentsData) : {},
                declarations: data,
              };
              
              // Submit the loan application
              const response = await postLoanApply(payload);
              
              if (response.ok) {
                // Navigate to submitted page with reference number
                router.push(`/apply-loan/submitted?ref=${response.ref}`);
              } else {
                Alert.alert('Submission Failed', response.message || 'Failed to submit loan application. Please try again.');
              }
            } catch (error) {
              console.error('Loan submission error:', error);
              Alert.alert('Error', 'An error occurred while submitting your application. Please try again.');
            }
          }}
        >
          <Text style={[styles.submitButtonText, { color: colors.textOnPrimary }]}>Submit Application</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
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
  declarationCard: {
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  declarationContent: {
    flex: 1,
  },
  declarationTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  declarationDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  linkText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  detailsInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginTop: 12,
    minHeight: 80,
  },
  fatcaDetailsInput: {
    marginTop: 16,
  },
  noticeCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noticeTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
  noticeText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  noticeList: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 8,
  },
  submitButtonContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: 'transparent',
    marginBottom: 35,
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
});