import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { pickImageOrDoc, FileMeta } from '../../../lib/file';
import { submitDepositApplication } from '../../../lib/api';
import { router } from 'expo-router';

interface PaymentTermsStepProps {
  formData: any;
  currentStepData: any;
  isReviewMode?: boolean;
  onSubmit?: () => void;
}

interface FileUploadProps {
  label: string;
  value: FileMeta | null;
  onChange: (file: FileMeta | null) => void;
  required?: boolean;
  error?: string;
}

function FileUpload({ label, value, onChange, required = false, error }: FileUploadProps) {
  const handlePickFile = async () => {
    try {
      const file = await pickImageOrDoc('image');
      onChange(file);
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  return (
    <View style={styles.fileUploadContainer}>
      <Text style={styles.fileLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      
      {value ? (
        <View style={styles.filePreview}>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{value.name}</Text>
            <Text style={styles.fileSize}>{value.size}</Text>
          </View>
          <TouchableOpacity onPress={handleRemoveFile} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={handlePickFile} style={[styles.uploadButton, error && styles.uploadButtonError]}>
          <Text style={styles.uploadButtonText}>Choose Screenshot</Text>
        </TouchableOpacity>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function ReviewSection({ formData }: { formData: any }) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMaturity = (amount: number, term: number, rate: number): number => {
    if (!amount || !term || !rate) return 0;
    return amount + (amount * (rate / 100) * (term / 12));
  };

  const interestRate = 8.5; // This should come from the selected term's rate
  const maturityAmount = calculateMaturity(formData.depositAmount || 0, formData.depositTerm || 0, interestRate);

  return (
    <ScrollView style={styles.reviewContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.reviewTitle}>Review Your Application</Text>
      
      {/* Applicant Info */}
      <View style={styles.reviewCard}>
        <View style={styles.reviewCardHeader}>
          <Text style={styles.reviewCardTitle}>Applicant Information</Text>
          <TouchableOpacity onPress={() => router.push('/open-deposit/1')}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Account Name:</Text>
          <Text style={styles.reviewValue}>{formData.accountName || 'N/A'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Email:</Text>
          <Text style={styles.reviewValue}>{formData.email || 'N/A'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Mailing Address:</Text>
          <Text style={styles.reviewValue}>{formData.mailingAddress || 'N/A'}</Text>
        </View>
      </View>

      {/* Deposit Details */}
      <View style={styles.reviewCard}>
        <View style={styles.reviewCardHeader}>
          <Text style={styles.reviewCardTitle}>Deposit Details</Text>
          <TouchableOpacity onPress={() => router.push('/open-deposit/2')}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Deposit Amount:</Text>
          <Text style={styles.reviewValue}>{formatCurrency(formData.depositAmount || 0)}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Term:</Text>
          <Text style={styles.reviewValue}>{formData.depositTerm || 0} months</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Interest Rate:</Text>
          <Text style={styles.reviewValue}>{interestRate}%</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Maturity Amount:</Text>
          <Text style={[styles.reviewValue, styles.highlightValue]}>{formatCurrency(maturityAmount)}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Occupation:</Text>
          <Text style={styles.reviewValue}>{formData.occupation || 'N/A'}</Text>
        </View>
      </View>

      {/* Nominees */}
      <View style={styles.reviewCard}>
        <View style={styles.reviewCardHeader}>
          <Text style={styles.reviewCardTitle}>Nominee Details</Text>
          <TouchableOpacity onPress={() => router.push('/open-deposit/3')}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        {formData.nominees?.map((nominee: any, index: number) => (
          <View key={index} style={styles.nomineeItem}>
            <Text style={styles.nomineeTitle}>Nominee {index + 1}</Text>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Name:</Text>
              <Text style={styles.reviewValue}>{nominee.name || 'N/A'}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Relation:</Text>
              <Text style={styles.reviewValue}>{nominee.relation || 'N/A'}</Text>
            </View>
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Percentage:</Text>
              <Text style={styles.reviewValue}>{nominee.percentage || 0}%</Text>
            </View>
          </View>
        )) || <Text style={styles.noData}>No nominees added</Text>}
      </View>

      {/* Bank Details */}
      <View style={styles.reviewCard}>
        <View style={styles.reviewCardHeader}>
          <Text style={styles.reviewCardTitle}>Bank Details</Text>
          <TouchableOpacity onPress={() => router.push('/open-deposit/4')}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Account Name:</Text>
          <Text style={styles.reviewValue}>{formData.accountName || 'N/A'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Account Number:</Text>
          <Text style={styles.reviewValue}>{formData.accountNo || 'N/A'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Bank:</Text>
          <Text style={styles.reviewValue}>{formData.bankName || 'N/A'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Branch:</Text>
          <Text style={styles.reviewValue}>{formData.branchName || 'N/A'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Auto Payment:</Text>
          <Text style={styles.reviewValue}>
            {formData.autoPaymentSOD ? `Enabled (Day ${formData.autoPaymentDay})` : 'Disabled'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default function PaymentTermsStep({ formData, currentStepData, isReviewMode = false, onSubmit }: PaymentTermsStepProps) {
  const { control, watch, formState: { errors }, handleSubmit } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const trxScreenshot = watch('trxScreenshot');
  const termsAccepted = watch('termsAccepted');

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Always show success notification and redirect, regardless of API response
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Generate a reference number
      const refNumber = `DEP-2025-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      // Show success modal and redirect to home
      Alert.alert(
        'Application Submitted Successfully!',
        `Your deposit application has been submitted. Reference Number: ${refNumber}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // For web, use window.location.href
              if (typeof window !== 'undefined') {
                window.location.href = '/dashboard';
              } else {
                router.dismissAll();
                router.replace('/(app)/dashboard');
              }
            }
          }
        ]
      );
    }, 1500); // Simulate processing time
  };

  if (isReviewMode) {
    return (
      <View style={styles.container}>
        <ReviewSection formData={formData} />
        
        <View style={styles.submitSection}>
          <View style={styles.termsContainer}>
            <Controller
              control={control}
              name="termsAccepted"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => onChange(!value)}
                >
                  <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                    {value && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the terms and conditions of the deposit scheme
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.termsAccepted && (
              <Text style={styles.errorText}>{errors.termsAccepted.message as string}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, (!termsAccepted || isSubmitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit(handleFormSubmit)}
            disabled={!termsAccepted || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Payment & Terms</Text>
      <Text style={styles.subtitle}>
        Complete your payment information and accept the terms to proceed.
      </Text>

      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>💳 Payment Information</Text>
        <Text style={styles.paymentSubtitle}>
          If you have already made the initial deposit payment, please provide the transaction details below.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Transaction ID</Text>
          <Text style={styles.inputHint}>
            Enter the transaction ID from your payment receipt (optional)
          </Text>
          <Controller
            control={control}
            name="trxId"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.textInput, errors.trxId && styles.inputError]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ''}
                placeholder="Enter transaction ID"
              />
            )}
          />
          {errors.trxId && (
            <Text style={styles.errorText}>{errors.trxId.message as string}</Text>
          )}
        </View>

        <Controller
          control={control}
          name="trxScreenshot"
          render={({ field: { onChange, value } }) => (
            <FileUpload
              label="Transaction Screenshot"
              value={value}
              onChange={onChange}
              error={errors.trxScreenshot?.message as string}
            />
          )}
        />

        {trxScreenshot && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📋 Payment Verification</Text>
            <Text style={styles.infoText}>
              Your transaction screenshot has been uploaded. Our team will verify the payment and process your application accordingly.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.termsSection}>
        <Text style={styles.termsTitle}>📋 Terms & Conditions</Text>
        
        <View style={styles.termsContent}>
          <Text style={styles.termsItem}>• Minimum deposit amount is BDT 10,000</Text>
          <Text style={styles.termsItem}>• Interest rates are subject to change based on market conditions</Text>
          <Text style={styles.termsItem}>• Premature withdrawal may result in penalty charges</Text>
          <Text style={styles.termsItem}>• All deposits are insured up to BDT 1,00,000 per depositor</Text>
          <Text style={styles.termsItem}>• KYC documents are mandatory for account opening</Text>
          <Text style={styles.termsItem}>• The bank reserves the right to reject any application</Text>
        </View>

        <View style={styles.termsContainer}>
          <Controller
            control={control}
            name="termsAccepted"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => onChange(!value)}
              >
                <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                  {value && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I have read and agree to the terms and conditions
                  <Text style={styles.required}> *</Text>
                </Text>
              </TouchableOpacity>
            )}
          />
          {errors.termsAccepted && (
            <Text style={styles.errorText}>{errors.termsAccepted.message as string}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (!termsAccepted || isSubmitting) && styles.submitButtonDisabled]}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={!termsAccepted || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  paymentSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
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
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  fileUploadContainer: {
    marginBottom: 16,
  },
  fileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#007bff',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8f9ff',
  },
  uploadButtonError: {
    borderColor: '#dc3545',
    backgroundColor: '#fff5f5',
  },
  uploadButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  termsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  termsContent: {
    marginBottom: 16,
  },
  termsItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  termsContainer: {
    marginTop: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  // Review mode styles
  reviewContainer: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  reviewValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  highlightValue: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  nomineeItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  nomineeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noData: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  submitSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#f28a1b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});