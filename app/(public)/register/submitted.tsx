import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';

export default function RegistrationSubmitted() {
  const { colors } = useTheme();
  const router = useRouter();
  const referenceId = 'REF-NC-2025-0001';

  const handleBackToHome = () => {
    router.replace('/');
  };

  const handleExit = () => {
    // On web, this will just go back to home
    // On native, this could close the app
    router.dismiss?.() || router.replace('/');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <CheckCircle2 
            size={64} 
            color={colors.accentOrange || colors.successGreen || colors.primary} 
          />
        </View>

        {/* Title */}
        <Text style={[
          styles.title,
          {
            fontFamily: 'Poppins_700Bold',
            fontSize: 20,
            color: colors.primaryNavy2,
            marginTop: 12,
            textAlign: 'center'
          }
        ]}>
          Registration Submitted
        </Text>

        {/* Subtitle */}
        <Text style={[
          styles.subtitle,
          {
            fontFamily: 'Poppins_400Regular',
            fontSize: 15,
            color: colors.textPrimary,
            marginTop: 8,
            textAlign: 'center'
          }
        ]}>
          Your registration request has been received.
        </Text>

        {/* Info Card */}
        <View style={[
          styles.infoCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border
          }
        ]}>
          <Text style={[
            styles.infoMessage,
            {
              fontFamily: 'Poppins_400Regular',
              fontSize: 14,
              color: colors.textPrimary,
              lineHeight: 20,
              textAlign: 'center'
            }
          ]}>
            NFL will review your information and approve your account. You will receive an SMS or Email once your registration is approved.
          </Text>

          {/* Reference ID */}
          <View style={styles.referenceContainer}>
            <Text style={[
              styles.referenceLabel,
              {
                fontFamily: 'Poppins_500Medium',
                fontSize: 12,
                color: colors.textSecondary
              }
            ]}>
              Reference ID
            </Text>
            <Text style={[
              styles.referenceId,
              {
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 16,
                color: colors.primary
              }
            ]}>
              {referenceId}
            </Text>
          </View>
        </View>

        {/* Button Row */}
        <View style={styles.buttonRow}>
          {/* Primary Button - Back to Home */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary
              }
            ]}
            onPress={handleBackToHome}
          >
            <Text style={[
              styles.primaryButtonText,
              {
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 16,
                color: colors.white
              }
            ]}>
              Back to Home
            </Text>
          </TouchableOpacity>

          {/* Secondary Button - Exit */}
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                borderColor: colors.border
              }
            ]}
            onPress={handleExit}
          >
            <Text style={[
              styles.secondaryButtonText,
              {
                fontFamily: 'Poppins_500Medium',
                fontSize: 14,
                color: colors.textPrimary
              }
            ]}>
              Exit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // Styles defined inline
  },
  subtitle: {
    // Styles defined inline
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginTop: 32,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
  },
  infoMessage: {
    // Styles defined inline
  },
  referenceContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  referenceLabel: {
    // Styles defined inline
  },
  referenceId: {
    marginTop: 4,
    // Other styles defined inline
  },
  buttonRow: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    // Styles defined inline
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    // Styles defined inline
  },
});