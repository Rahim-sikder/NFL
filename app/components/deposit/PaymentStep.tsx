import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '../ui/Icon';
import { initiateDepositPayment } from '../../../lib/api';

const DRAFT_KEY = 'odraft';

interface PaymentStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  formData: any;
}

export default function PaymentStep({ onNext, onPrev, formData }: PaymentStepProps) {
  const router = useRouter();
  const [depositData, setDepositData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState('');
  const [txnId, setTxnId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    loadDepositData();
  }, []);

  const loadDepositData = async () => {
    try {
      const draft = await AsyncStorage.getItem(DRAFT_KEY);
      if (draft) {
        setDepositData(JSON.parse(draft));
      }
    } catch (error) {
      console.error('Error loading deposit data:', error);
    }
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  const initiatePayment = async () => {
    if (!termsAccepted) {
      Alert.alert('Terms Required', 'Please accept the Terms and Conditions to proceed.');
      return;
    }
    
    if (!depositData) {
      Alert.alert('Error', 'Deposit data not found. Please start over.');
      return;
    }

    setLoading(true);
    try {
      const response = await initiateDepositPayment({
        depositId: `DEP_${Date.now()}`,
        amount: depositData[1]?.depositAmount || 10000,
        userId: 'user123'
      });

      setGatewayUrl(response.gatewayUrl);
      setTxnId(response.txnId);
      
      // For web platform, show dummy gateway interface
      if (Platform.OS === 'web') {
        setShowWebView(true);
      } else {
        // For mobile, you could use WebView or redirect to external browser
        Alert.alert('Payment Gateway', 'Redirecting to secure payment gateway...', [
          { text: 'OK', onPress: () => setShowWebView(true) }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
      console.error('Payment initiation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    if (url.includes('/open-deposit/payment/success')) {
      setShowWebView(false);
      // Clear draft on successful payment
      clearDraft();
      router.push(`/open-deposit/payment/success?txn=${txnId}`);
    } else if (url.includes('/open-deposit/payment/failed')) {
      setShowWebView(false);
      router.push(`/open-deposit/payment/failed?txn=${txnId}`);
    } else if (url.includes('/open-deposit/payment/cancel')) {
      setShowWebView(false);
      router.push(`/open-deposit/payment/cancel?txn=${txnId}`);
    }
  };

  const handlePaymentResult = (result: string) => {
    setShowWebView(false);
    if (result === 'success') {
      clearDraft();
      router.push(`/open-deposit/payment/success?txn=${txnId}`);
    } else if (result === 'failed') {
      router.push(`/open-deposit/payment/failed?txn=${txnId}`);
    } else if (result === 'cancel') {
      router.push(`/open-deposit/payment/cancel?txn=${txnId}`);
    }
  };

  if (showWebView) {
    return (
      <View style={styles.webViewContainer}>
        <View style={styles.gatewayHeader}>
          <Text style={styles.gatewayTitle}>Secure Payment Gateway</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowWebView(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.gatewayContent}>
          <Text style={styles.merchantName}>National Finance Limited</Text>
          <Text style={styles.transactionId}>Transaction ID: {txnId}</Text>
          
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amountValue}>
              BDT {depositData?.[1]?.depositAmount?.toLocaleString() || '10,000'}
            </Text>
          </View>
          
          <View style={styles.paymentMethods}>
            <Text style={styles.methodsTitle}>Select Payment Method</Text>
            
            <TouchableOpacity style={styles.paymentOption}>
              <Text style={styles.optionText}>💳 Credit/Debit Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.paymentOption}>
              <Text style={styles.optionText}>🏦 Mobile Banking</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.paymentOption}>
              <Text style={styles.optionText}>💰 Net Banking</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.gatewayActions}>
            <TouchableOpacity 
              style={[styles.gatewayButton, styles.successButton]}
              onPress={() => handlePaymentResult('success')}
            >
              <Text style={styles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gatewayButton, styles.failButton]}
              onPress={() => handlePaymentResult('failed')}
            >
              <Text style={styles.buttonText}>Simulate Failure</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gatewayButton, styles.cancelButton]}
              onPress={() => handlePaymentResult('cancel')}
            >
              <Text style={styles.buttonText}>Cancel Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Icon name="credit-card" size={24} color="#0F5AA6" />
          <Text style={styles.cardTitle}>Payment Summary</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Deposit Amount:</Text>
          <Text style={styles.summaryValue}>
            BDT {(depositData?.[1]?.depositAmount || 0).toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Account Type:</Text>
          <Text style={styles.summaryValue}>
            {depositData?.[1]?.accountType || 'Savings Account'}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Term:</Text>
          <Text style={styles.summaryValue}>
            {depositData?.[1]?.term || '12'} months
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Account Holder:</Text>
          <Text style={styles.summaryValue}>
            {depositData?.[2]?.nomineeName || 'Account Holder'}
          </Text>
        </View>
      </View>

      {/* TERMS AND CONDITIONS CHECKBOX */}
      <View style={styles.termsContainer}>
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
            {termsAccepted && <Icon name="check" size={16} color="#fff" />}
          </View>
          <Text style={styles.termsText}>
            I have read Terms and Condition
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.paymentButton, (!termsAccepted || loading) && styles.disabledButton]}
        onPress={initiatePayment}
        disabled={!termsAccepted || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Icon name="credit-card" size={20} color="#fff" />
            <Text style={styles.paymentButtonText}>Make Payment</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F5AA6',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  instructionCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginLeft: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#155724',
    lineHeight: 20,
  },
  paymentButton: {
    backgroundColor: '#0F5AA6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 3,
    borderColor: '#1976D2',
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1976D2',
  },
  termsText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '600',
    lineHeight: 22,
  },
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  dummyGateway: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  gatewayHeader: {
    backgroundColor: '#1976D2',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gatewayTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gatewayContent: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  transactionId: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  amountSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976D2',
  },
  paymentMethods: {
    marginBottom: 20,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  paymentOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  gatewayActions: {
    padding: 20,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  gatewayButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  failButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});