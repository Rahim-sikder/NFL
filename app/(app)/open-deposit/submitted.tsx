import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from '../../components/ui/Icon';

export default function DepositSubmittedScreen() {
  const { ref } = useLocalSearchParams<{ ref: string }>();

  // Disable back navigation
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent default back action
      };

      // For Android hardware back button
      const subscription = router.addListener?.('beforeRemove', (e) => {
        e.preventDefault();
      });

      return () => subscription?.();
    }, [])
  );

  const handleReturnToDashboard = async () => {
    // Clear the draft data
    try {
      await AsyncStorage.removeItem('odraft');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
    
    router.replace('/dashboard');
  };

  const handleOpenAnother = async () => {
    // Clear the draft data
    try {
      await AsyncStorage.removeItem('odraft');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
    
    router.replace('/open-deposit/1');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.successIcon}>
        <Icon name="check-circle" size={48} color="#fff" />
      </View>
      
      <Text style={styles.title}>Deposit Application Submitted</Text>
      
      <Text style={styles.subtitle}>
        Reference ID {ref || 'DEP-2025-0001'}. NFL will review and notify you.
      </Text>

      <View style={styles.referenceContainer}>
        <Text style={styles.referenceLabel}>Reference ID</Text>
        <Text style={styles.referenceNumber}>{ref || 'DEP-2025-0001'}</Text>
        <Text style={styles.referenceNote}>
          Please save this reference ID for future correspondence.
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What happens next?</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Document Verification</Text>
              <Text style={styles.stepDescription}>
                Our team will verify all submitted documents within 1-2 business days.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Payment Confirmation</Text>
              <Text style={styles.stepDescription}>
                If payment details were provided, we'll verify the transaction.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Account Activation</Text>
              <Text style={styles.stepDescription}>
                Once approved, your deposit account will be activated and you'll receive a confirmation.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Need Help?</Text>
        <Text style={styles.contactText}>
          If you have any questions about your application, please contact us:
        </Text>
        <Text style={styles.contactInfo}>📞 +880-2-123456789</Text>
        <Text style={styles.contactInfo}>✉️ support@nflbank.com</Text>
        <Text style={styles.contactInfo}>🕒 9:00 AM - 5:00 PM (Sunday to Thursday)</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleReturnToDashboard}
        >
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleOpenAnother}
        >
          <Text style={styles.secondaryButtonText}>Open Another Deposit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  checkmark: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  referenceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  referenceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  referenceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  referenceNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  stepContainer: {
    marginTop: 8,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#b3d9ff',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  contactInfo: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 4,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007bff',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});