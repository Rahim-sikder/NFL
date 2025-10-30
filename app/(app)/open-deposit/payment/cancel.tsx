import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Icon } from '../../../components/ui/Icon';

export default function PaymentCancelScreen() {
  const router = useRouter();
  const { txn } = useLocalSearchParams();

  const handleRetryPayment = () => {
    router.back(); // Go back to payment screen
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleSaveDraft = () => {
    // Draft is already saved, just show confirmation
    router.push('/dashboard');
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
        <View style={styles.cancelCard}>
          <View style={styles.iconContainer}>
            <View style={styles.cancelIcon}>
              <Icon name="info" size={48} color="#fff" />
            </View>
          </View>

          <Text style={styles.cancelTitle}>Payment Cancelled</Text>
          <Text style={styles.cancelMessage}>
            You have cancelled the payment process. No charges have been applied to your account.
          </Text>

          {txn && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Transaction Reference:</Text>
                <Text style={styles.detailValue}>{txn}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailValue, styles.cancelStatus]}>Cancelled</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time:</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleString('en-BD')}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.infoBox}>
            <Icon name="save" size={20} color="#0F5AA6" />
            <Text style={styles.infoText}>
              Your deposit application details have been saved as a draft. You can complete the payment later from your dashboard.
            </Text>
          </View>

          <View style={styles.nextStepsBox}>
            <Text style={styles.nextStepsTitle}>What happens next?</Text>
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Your application is saved as draft</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Complete payment when ready</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Account activation within 1-2 days</Text>
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
          <Icon name="credit-card" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Retry Payment</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryButtons}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleSaveDraft}
          >
            <Icon name="save" size={18} color="#0F5AA6" />
            <Text style={styles.secondaryButtonText}>Save Draft</Text>
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
  cancelCard: {
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
  cancelIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  cancelMessage: {
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
  cancelStatus: {
    color: '#6c757d',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#0F5AA6',
    flex: 1,
    lineHeight: 18,
  },
  nextStepsBox: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0F5AA6',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  stepsList: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F5AA6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  stepText: {
    fontSize: 14,
    color: '#666',
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