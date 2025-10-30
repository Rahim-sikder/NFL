import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Linking, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Icon } from '../../components/ui/Icon';
import { initiateDepositPayment } from '../../../lib/api';

const DRAFT_KEY = 'odraft';

export default function PaymentScreen() {
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

  const initiatePayment = async () => {
    if (!depositData) {
      Alert.alert('Error', 'Deposit data not found. Please start over.');
      return;
    }

    setLoading(true);
    try {
      const response = await initiateDepositPayment({
        depositId: `DEP_${Date.now()}`,
        amount: depositData.depositAmount || 10000,
        userId: 'user123'
      });

      setGatewayUrl(response.gatewayUrl);
      setTxnId(response.txnId);
      setShowWebView(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
      console.error('Payment initiation error:', error);
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (showWebView) {
    return (
      <View style={styles.webViewContainer}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowWebView(false)}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>Secure Payment</Text>
        </View>
        <WebView
          source={{ uri: gatewayUrl }}
          style={styles.webView}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading payment gateway...</Text>
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
            Alert.alert('Error', 'Failed to load payment gateway. Please try again.');
            setShowWebView(false);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error: ', nativeEvent);
            Alert.alert('Error', 'Payment gateway error. Please try again.');
            setShowWebView(false);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Make Payment</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="credit-card" size={24} color="#0F5AA6" />
            <Text style={styles.summaryTitle}>Deposit Summary</Text>
          </View>
          
          {depositData && (
            <View style={styles.summaryDetails}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Account Name:</Text>
                <Text style={styles.summaryValue}>
                  {depositData.applicantName || 'N/A'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Deposit Amount:</Text>
                <Text style={styles.summaryValue}>
                  {formatAmount(depositData.depositAmount || 10000)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Term:</Text>
                <Text style={styles.summaryValue}>
                  {depositData.term || '12'} months
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Interest Rate:</Text>
                <Text style={styles.summaryValue}>
                  {depositData.interestRate || '8.5'}% per annum
                </Text>
              </View>
            </View>
          )}
        </View>



        {/* TERMS AND CONDITIONS CHECKBOX - MUST BE VISIBLE */}
        <View style={styles.termsContainer}>
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
              {termsAccepted && <Icon name="check" size={18} color="#fff" />}
            </View>
            <Text style={styles.termsText}>
              I have read Terms and Condition
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.paymentButton, 
              (loading || !termsAccepted) && styles.disabledButton
            ]}
            onPress={initiatePayment}
            disabled={loading || !termsAccepted}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon name="lock" size={20} color="#fff" />
                <Text style={styles.paymentButtonText}>Make Payment</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  header: {
    backgroundColor: '#0F5AA6',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0A2E5C',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  stepInfo: {
    flex: 1,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    flexGrow: 1,
    minHeight: '100%',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  summaryDetails: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  instructionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  paymentMethods: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  methodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  methodsList: {
    gap: 8,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodText: {
    fontSize: 14,
    color: '#666',
  },
  termsContainer: {
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#0F5AA6',
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
    borderColor: '#0F5AA6',
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0F5AA6',
  },
  termsText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '600',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 46,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentButton: {
    backgroundColor: '#0F5AA6',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webViewHeader: {
    backgroundColor: '#0F5AA6',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  closeButton: {
    padding: 8,
  },
  webViewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});