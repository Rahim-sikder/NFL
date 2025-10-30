import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '../../../components/ui/Icon';
import { verifyDepositPayment } from '../../../../lib/api';

const DRAFT_KEY = 'odraft';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { txn } = useLocalSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyPayment();
    clearDraft();
  }, []);

  const verifyPayment = async () => {
    if (!txn) return;
    
    try {
      const result = await verifyDepositPayment({ txnId: txn as string });
      setPaymentDetails(result);
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleViewDeposits = () => {
    router.push('/deposit');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Verifying payment...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Payment Status</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.successCard}>
          <View style={styles.iconContainer}>
            <View style={styles.successIcon}>
              <Icon name="check" size={48} color="#fff" />
            </View>
          </View>

          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successMessage}>
            Your deposit application has been submitted successfully.
          </Text>

          {paymentDetails && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction ID:</Text>
                <Text style={styles.detailValue}>{paymentDetails.transactionId}</Text>
              </View>
              {paymentDetails.amount && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount Paid:</Text>
                  <Text style={styles.detailValue}>
                    {new Intl.NumberFormat('en-BD', {
                      style: 'currency',
                      currency: 'BDT',
                      minimumFractionDigits: 0
                    }).format(paymentDetails.amount)}
                  </Text>
                </View>
              )}
              {paymentDetails.paymentMethod && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Method:</Text>
                  <Text style={styles.detailValue}>{paymentDetails.paymentMethod}</Text>
                </View>
              )}
              {paymentDetails.timestamp && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date & Time:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(paymentDetails.timestamp).toLocaleString('en-BD')}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.infoBox}>
            <Icon name="info-circle" size={20} color="#0F5AA6" />
            <Text style={styles.infoText}>
              You will receive a confirmation email shortly. Your deposit account will be activated within 1-2 business days.
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleBackToDashboard}
        >
          <Icon name="home" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleViewDeposits}
        >
          <Icon name="building-bank" size={20} color="#0F5AA6" />
          <Text style={styles.secondaryButtonText}>View My Deposits</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0A2E5C',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#0F5AA6',
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#0F5AA6',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0F5AA6',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#0F5AA6',
    fontSize: 16,
    fontWeight: '600',
  },
});