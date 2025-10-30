import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Icon } from '../../../components/ui/Icon';

export default function PaymentFailedScreen() {
  const router = useRouter();
  const { txn } = useLocalSearchParams();

  const handleRetryPayment = () => {
    router.back(); // Go back to payment screen
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleContactSupport = () => {
    // In a real app, this would open support chat or phone dialer
    console.log('Contact support');
  };

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
        <View style={styles.failedCard}>
          <View style={styles.iconContainer}>
            <View style={styles.failedIcon}>
              <Icon name="x" size={48} color="#fff" />
            </View>
          </View>

          <Text style={styles.failedTitle}>Payment Failed</Text>
          <Text style={styles.failedMessage}>
            We couldn't process your payment. This could be due to insufficient funds, network issues, or other technical problems.
          </Text>

          {txn && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction Reference:</Text>
                <Text style={styles.detailValue}>{txn}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, styles.failedStatus]}>Failed</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time:</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleString('en-BD')}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.troubleshootBox}>
            <Text style={styles.troubleshootTitle}>What you can do:</Text>
            <View style={styles.troubleshootList}>
              <View style={styles.troubleshootItem}>
                <Icon name="check-circle" size={16} color="#28a745" />
                <Text style={styles.troubleshootText}>Check your account balance</Text>
              </View>
              <View style={styles.troubleshootItem}>
                <Icon name="check-circle" size={16} color="#28a745" />
                <Text style={styles.troubleshootText}>Verify your card details</Text>
              </View>
              <View style={styles.troubleshootItem}>
                <Icon name="check-circle" size={16} color="#28a745" />
                <Text style={styles.troubleshootText}>Try a different payment method</Text>
              </View>
              <View style={styles.troubleshootItem}>
                <Icon name="check-circle" size={16} color="#28a745" />
                <Text style={styles.troubleshootText}>Contact your bank if issue persists</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleRetryPayment}
        >
          <Icon name="refresh-cw" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Retry Payment</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryButtons}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleContactSupport}
          >
            <Icon name="phone" size={18} color="#0F5AA6" />
            <Text style={styles.secondaryButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleBackToDashboard}
          >
            <Icon name="home" size={18} color="#0F5AA6" />
            <Text style={styles.secondaryButtonText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
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
  failedCard: {
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
  failedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  failedMessage: {
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
  failedStatus: {
    color: '#dc3545',
  },
  troubleshootBox: {
    width: '100%',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 12,
  },
  troubleshootList: {
    gap: 8,
  },
  troubleshootItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  troubleshootText: {
    fontSize: 14,
    color: '#856404',
    flex: 1,
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
  secondaryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0F5AA6',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#0F5AA6',
    fontSize: 14,
    fontWeight: '600',
  },
});