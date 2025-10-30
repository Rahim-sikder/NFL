import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import { getInterestRates, InterestRate } from '../../lib/api';
import Icon from '../components/ui/Icon';

export default function InterestRateChart() {
  const { colors } = useTheme();
  const router = useRouter();
  const [interestRates, setInterestRates] = useState<InterestRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInterestRates();
  }, []);

  const loadInterestRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const rates = await getInterestRates();
      setInterestRates(rates);
    } catch (error) {
      console.error('Error loading interest rates:', error);
      setError('Failed to load interest rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTerm = (months: number): string => {
    if (months < 12) {
      return `${months} Month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} Year${years > 1 ? 's' : ''}`;
      } else {
        return `${years}Y ${remainingMonths}M`;
      }
    }
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.primaryNavy2, borderBottomColor: colors.border }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon icon="ArrowLeft" size="md" color="#ffffff" />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: '#ffffff' }]}>Interest Rate Chart</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderRateCard = (rate: InterestRate, index: number) => (
    <View key={rate.termMonths} style={[styles.rateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.rateCardContent}>
        <View style={styles.termSection}>
          <Icon icon="Calendar" size="sm" color={colors.primaryNavy2} />
          <Text style={[styles.termText, { color: colors.textPrimary }]}>
            {formatTerm(rate.termMonths)}
          </Text>
        </View>
        <View style={styles.rateSection}>
          <Text style={[styles.rateValue, { color: colors.primaryNavy2 }]}>
            {rate.rate}%
          </Text>
          <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>per annum</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNavy2} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading interest rates...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Icon icon="AlertCircle" size="lg" color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primaryNavy2 }]}
            onPress={loadInterestRates}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Icon icon="Info" size="sm" color={colors.primaryNavy2} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Current deposit interest rates. Rates are subject to change based on market conditions.</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Deposit Interest Rates</Text>
        
        <View style={styles.ratesList}>
          {interestRates.map((rate, index) => renderRateCard(rate, index))}
        </View>

        <View style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.noteTitle, { color: colors.textPrimary }]}>Important Notes:</Text>
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>• Interest rates are calculated on a simple interest basis</Text>
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>• Minimum deposit amount may apply for each term</Text>
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>• Early withdrawal may result in penalty charges</Text>
          <Text style={[styles.noteText, { color: colors.textSecondary }]}>• Rates are subject to change without prior notice</Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
  },
  ratesList: {
    marginBottom: 24,
  },
  rateCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  rateCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  termSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  termText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 12,
  },
  rateSection: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
  },
  rateLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
  noteCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
    lineHeight: 20,
  },
});