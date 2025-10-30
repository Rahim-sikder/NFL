import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '../../components/ui/Icon';
import { submitDepositApplication } from '../../../lib/api';

const DRAFT_KEY = 'odraft';

interface ApplicationData {
  applicantInfo?: any;
  depositDetails?: any;
  nomineeDetails?: any;
  bankDetails?: any;
  paymentTerms?: any;
}

export default function ReviewSubmit() {
  const router = useRouter();
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDraftData();
  }, []);

  const loadDraftData = async () => {
    try {
      const draftData = await AsyncStorage.getItem(DRAFT_KEY);
      if (draftData) {
        setApplicationData(JSON.parse(draftData));
      }
    } catch (error) {
      console.error('Error loading draft data:', error);
    }
  };

  const handleEdit = (step: number) => {
    router.push(`/open-deposit/${step}`);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Submit application
      const response = await submitDepositApplication(applicationData);
      
      // Clear draft data
      await AsyncStorage.removeItem(DRAFT_KEY);
      
      // Navigate to confirmation
      router.replace(`/open-deposit/submitted?ref=${response.referenceId || 'DEP-2025-0001'}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Application',
      'Are you sure you want to cancel? Your progress will be saved as draft.',
      [
        { text: 'Continue', style: 'cancel' },
        { text: 'Cancel', onPress: () => router.replace('/dashboard') }
      ]
    );
  };

  const renderSummaryCard = (title: string, data: any, stepNumber: number) => {
    if (!data) return null;

    return (
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEdit(stepNumber)}
          >
            <Icon name="edit" size={16} color="#0A2E5C" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          {renderCardContent(data, stepNumber)}
        </View>
      </View>
    );
  };

  const renderCardContent = (data: any, stepNumber: number) => {
    switch (stepNumber) {
      case 1: // Applicant Info
        return (
          <>
            <Text style={styles.dataRow}>Name: {data.fullName}</Text>
            <Text style={styles.dataRow}>Email: {data.email}</Text>
            <Text style={styles.dataRow}>Phone: {data.phone}</Text>
            <Text style={styles.dataRow}>NID: {data.nid}</Text>
            <Text style={styles.dataRow}>Address: {data.address}</Text>
          </>
        );
      case 2: // Deposit Details
        return (
          <>
            <Text style={styles.dataRow}>Amount: ৳{data.depositAmount?.toLocaleString()}</Text>
            <Text style={styles.dataRow}>Term: {data.depositTerm} months</Text>
            <Text style={styles.dataRow}>Occupation: {data.occupation}</Text>
            {data.interestRate && (
              <Text style={styles.highlightRow}>Interest Rate: {data.interestRate}%</Text>
            )}
            {data.maturityValue && (
              <Text style={styles.highlightRow}>Maturity Value: ৳{data.maturityValue?.toLocaleString()}</Text>
            )}
          </>
        );
      case 3: // Nominee Details
        return (
          <>
            {data.nominees?.map((nominee: any, index: number) => (
              <View key={index} style={styles.nomineeItem}>
                <Text style={styles.dataRow}>Nominee {index + 1}: {nominee.name}</Text>
                <Text style={styles.dataRow}>Relation: {nominee.relation}</Text>
                <Text style={styles.dataRow}>Percentage: {nominee.percentage}%</Text>
              </View>
            ))}
          </>
        );
      case 4: // Bank Details
        return (
          <>
            <Text style={styles.dataRow}>Account Name: {data.accountName}</Text>
            <Text style={styles.dataRow}>Account No: {data.accountNo}</Text>
            <Text style={styles.dataRow}>Bank: {data.bankName || 'Not specified'}</Text>
            <Text style={styles.dataRow}>Branch: {data.branchName}</Text>
            <Text style={styles.dataRow}>Auto Payment: {data.autoPayment ? 'Yes' : 'No'}</Text>
            {data.autoPayment && data.autoPaymentDay && (
              <Text style={styles.dataRow}>Payment Day: {data.autoPaymentDay}</Text>
            )}
          </>
        );
      case 5: // Payment
        return (
          <>
            <Text style={styles.dataRow}>Terms Accepted: {data.termsAccepted ? 'Yes' : 'No'}</Text>
            {data.trxId && <Text style={styles.dataRow}>Transaction ID: {data.trxId}</Text>}
            {data.trxScreenshot && <Text style={styles.dataRow}>Screenshot: Uploaded</Text>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>Review & Submit</Text>
          <Text style={styles.stepIndicator}>Review</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderSummaryCard('Applicant Information', applicationData.applicantInfo, 1)}
        {renderSummaryCard('Deposit Details', applicationData.depositDetails, 2)}
        {renderSummaryCard('Nominee Details', applicationData.nomineeDetails, 3)}
        {renderSummaryCard('Bank Details', applicationData.bankDetails, 4)}
        {renderSummaryCard('Payment & Terms', applicationData.paymentTerms, 5)}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, styles.cancelButton]}
          onPress={handleCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0F5AA6',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#0A2E5C',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    color: '#0A2E5C',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    padding: 16,
  },
  dataRow: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  highlightRow: {
    fontSize: 14,
    color: '#0A2E5C',
    fontWeight: '600',
    marginBottom: 8,
  },
  nomineeItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0A2E5C',
  },
  submitButton: {
    backgroundColor: '#0A2E5C',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#0A2E5C',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});