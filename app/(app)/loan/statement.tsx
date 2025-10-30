import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../../components/ui/Icon';
import { getLoanAccounts, LoanAccount } from '../../../lib/api';

// Interfaces are now imported from api.ts

export default function AccountStatementScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [loanAccounts, setLoanAccounts] = useState<LoanAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLoanAccounts();
  }, []);

  const loadLoanAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await getLoanAccounts();
      setLoanAccounts(accounts);
    } catch (error) {
      console.error('Error loading loan accounts:', error);
      Alert.alert('Error', 'Failed to load loan accounts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLoanAccounts();
    setRefreshing(false);
  };

  const handleAccountPress = (accountId: string) => {
    router.push(`/loan/statement/view?acct=${accountId}`);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#28a745';
      case 'Closed':
        return '#6c757d';
      case 'Overdue':
        return '#dc3545';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="ArrowLeft" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Statement</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Loan Accounts
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Tap on any account to view its statement
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryNavy2} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading accounts...
            </Text>
          </View>
        ) : (
          <View style={styles.accountsList}>
            {loanAccounts.map((account) => (
              <Pressable
                key={account.id}
                style={[
                  styles.accountCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => handleAccountPress(account.id)}
                accessibilityRole="button"
                accessibilityLabel={`Open statement for ${account.maskedNo || account.id}`}
                hitSlop={8}
              >
                <View style={styles.accountHeader}>
                  <View style={styles.accountInfo}>
                  <Text style={[styles.accountNumber, { color: colors.textPrimary }]}>
                    {account.maskedNo || account.accountNumber}
                  </Text>
                  <Text style={[styles.loanType, { color: colors.textSecondary }]}>
                    {account.productName}
                  </Text>
                </View>
                <View style={styles.navigationIndicator}>
                  <Icon name="ChevronRight" size={20} color={colors.textSecondary} />
                </View>
              </View>

              <View style={styles.accountDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Current Balance
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {formatCurrency(account.currentBalance)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    EMI Amount
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {formatCurrency(account.emiAmount)}
                  </Text>
                </View>
                
                {account.status === 'Active' && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                      Next EMI Date
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {formatDate(account.nextEmiDate)}
                    </Text>
                  </View>
                )}
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(account.status) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(account.status) },
                        ]}
                      >
                        {account.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
    marginRight: -8,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 24,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  accountsList: {
    gap: 16,
  },
  accountCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountNumber: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  loanType: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  navigationIndicator: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  accountDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },

});