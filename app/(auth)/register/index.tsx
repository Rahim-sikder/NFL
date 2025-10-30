import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon } from '../../components/ui/Icon';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.pageTitle, { color: colors.primaryNavy2 }]}>
        Sign Up
      </Text>
      
      <View style={styles.cardsContainer}>
        <Pressable 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => router.push('/register/existing/step1')}
          android_ripple={{ color: colors.primary + '20' }}
        >
          <View style={styles.cardContent}>
            <Icon icon="UserCheck" size={48} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Existing Customer
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Already have an account with us? Continue here
            </Text>
          </View>
        </Pressable>

        <Pressable 
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => router.push('/register/new/otp')}
          android_ripple={{ color: colors.primary + '20' }}
        >
          <View style={styles.cardContent}>
            <Icon icon="UserPlus" size={48} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              New Customer
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              First time with us? Start your registration here
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pageTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 140,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 17,
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});