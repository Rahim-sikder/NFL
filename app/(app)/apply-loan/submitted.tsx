import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../../components/ui/Icon';

export default function LoanApplicationSubmitted() {
  const { colors } = useTheme();
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const referenceNumber = ref || 'LN-2025-0001';

  const handleBackToDashboard = () => {
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View
          style={[
            styles.successIconContainer,
            { backgroundColor: colors.success + '20' },
          ]}
        >
          <View
            style={[
              styles.successIcon,
              { backgroundColor: colors.success },
            ]}
          >
            <Icon icon="Check" size={48} color="#fff" />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Loan Application Submitted
        </Text>

        {/* Reference Number */}
        <View
          style={[
            styles.referenceCard,
            {
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '30',
            },
          ]}
        >
          <Text style={[styles.referenceLabel, { color: colors.textSecondary }]}>
            Reference Number
          </Text>
          <Text style={[styles.referenceNumber, { color: colors.primary }]}>
            {referenceNumber}
          </Text>
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Thank you for submitting your loan application to National Finance Limited. 
          Our team will review your application and contact you within 3-5 business days.
        </Text>




      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleBackToDashboard}
        >
          <Icon icon="Home" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  referenceCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  referenceLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  referenceNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    letterSpacing: 1,
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    padding: 24,
    gap: 12,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});