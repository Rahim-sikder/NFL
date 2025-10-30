import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../../components/ui/Icon';

interface DepositAccount {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  maturityDate?: string;
  interestRate: number;
  status: 'Active' | 'Matured' | 'Closed';
}

export default function DepositStatementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [accounts, setAccounts] = useState<DepositAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock API call to fetch deposit accounts
  const fetchDepositAccounts = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockAccounts: DepositAccount[] = [
        {
          id: '1',
          accountNumber: 'FD001234567890',
          accountType: 'Fixed Deposit',
          balance: 500000,
          maturityDate: '2024-12-31',
          interestRate: 7.5,
          status: 'Active',
        },
        {
          id: '2',
          accountNumber: 'RD001234567891',
          accountType: 'Recurring Deposit',
          balance: 120000,
          maturityDate: '2025-06-30',
          interestRate: 6.8,
          status: 'Active',
        },
        {
          id: '3',
          accountNumber: 'SB001234567892',
          accountType: 'Savings Account',
          balance: 75000,
          interestRate: 4.0,
          status: 'Active',
        },
        {
          id: '4',
          accountNumber: 'FD001234567893',
          accountType: 'Fixed Deposit',
          balance: 1000000,
          maturityDate: '2023-12-31',
          interestRate: 7.0,
          status: 'Matured',
        },
      ];
      
      setAccounts(mockAccounts);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch deposit accounts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDepositAccounts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDepositAccounts();
  };

  const handleAccountPress = (account: DepositAccount) => {
    router.push({
      pathname: '/deposit/statement/view',
      params: {
        accountId: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return colors.success;
      case 'Matured':
        return colors.warning;
      case 'Closed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case 'Fixed Deposit':
        return 'Vault';
      case 'Recurring Deposit':
        return 'Repeat';
      case 'Savings Account':
        return 'PiggyBank';
      default:
        return 'Wallet';
    }
  };

  const renderAccountCard = (account: DepositAccount) => (
    <TouchableOpacity
      key={account.id}
      style={[styles.accountCard, { backgroundColor: colors.surface }]}
      onPress={() => handleAccountPress(account)}
      activeOpacity={0.7}
    >
      <View style={styles.accountHeader}>
        <View style={styles.accountInfo}>
          <View style={styles.accountTitleRow}>
            <Icon
              name={getAccountIcon(account.accountType)}
              size={20}
              color={colors.primary}
              style={styles.accountIcon}
            />
            <Text style={[styles.accountType, { color: colors.text }]}>
              {account.accountType}
            </Text>
          </View>
          <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
            {account.accountNumber}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(account.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(account.status) }]}>
              {account.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.accountDetails}>
        <View style={styles.balanceContainer}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>
            {formatCurrency(account.balance)}
          </Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Interest Rate</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {account.interestRate}% p.a.
            </Text>
          </View>
          
          {account.maturityDate && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Maturity Date</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {new Date(account.maturityDate).toLocaleDateString('en-GB')}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.viewStatementText, { color: colors.primary }]}>View Statement</Text>
        <Icon name="ChevronRight" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon icon="ArrowLeft" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Deposit Account Statement</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading accounts...</Text>
            </View>
          ) : accounts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="Wallet" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Deposit Accounts</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                You don't have any deposit accounts yet.
              </Text>
            </View>
          ) : (
            <View style={styles.accountsList}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Deposit Accounts</Text>
              {accounts.map(renderAccountCard)}
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
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginTop: 4,
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  accountsList: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 16,
  },
  accountCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
  accountTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  accountIcon: {
    marginRight: 8,
  },
  accountType: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  accountNumber: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
  },
  accountDetails: {
    marginBottom: 12,
  },
  balanceContainer: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  viewStatementText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
});