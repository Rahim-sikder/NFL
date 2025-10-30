import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';
import { getLoanAccounts, getDepositAccounts, LoanAccount, DepositAccount } from '../../lib/api';

type AccountTab = 'all' | 'deposits' | 'loans';

export default function AccountsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<AccountTab>('all');
  const [loanAccounts, setLoanAccounts] = useState<LoanAccount[]>([]);
  const [depositAccounts, setDepositAccounts] = useState<DepositAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for expandable tax certificate buttons
  const [depositTaxExpanded, setDepositTaxExpanded] = useState(false);
  const [loanTaxExpanded, setLoanTaxExpanded] = useState(false);
  const depositTaxAnimation = new Animated.Value(0);
  const loanTaxAnimation = new Animated.Value(0);

  const loadAccounts = async () => {
    try {
      const [loans, deposits] = await Promise.all([
        getLoanAccounts(),
        getDepositAccounts(),
      ]);
      setLoanAccounts(loans);
      setDepositAccounts(deposits);
    } catch (error) {
      Alert.alert('Error', 'Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // Handle tab parameter from navigation
  useEffect(() => {
    if (tab === 'loans') {
      setActiveTab('loans');
    } else if (tab === 'deposits') {
      setActiveTab('deposits');
    }
  }, [tab]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAccounts();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Animation functions for tax certificate buttons
  const toggleDepositTax = () => {
    const toValue = depositTaxExpanded ? 0 : 1;
    setDepositTaxExpanded(!depositTaxExpanded);
    
    Animated.timing(depositTaxAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleLoanTax = () => {
    const toValue = loanTaxExpanded ? 0 : 1;
    setLoanTaxExpanded(!loanTaxExpanded);
    
    Animated.timing(loanTaxAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const navigateToDepositTaxCertificate = () => {
    router.push('/deposit/tax-certificate');
  };

  const navigateToLoanTaxCertificate = () => {
    router.push('/loan/tax-certificate');
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'Personal Loan':
      case 'Home Loan':
      case 'Car Loan':
        return 'CreditCard';
      case 'Savings':
      case 'Premium Savings Account':
        return 'PiggyBank';
      case 'Current':
      case 'Current Account':
        return 'Building';
      case 'Fixed Deposit':
        return 'TrendingUp';
      case 'DPS':
        return 'Calendar';
      default:
        return 'Wallet';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return colors.success;
      case 'Overdue':
        return colors.error;
      case 'Matured':
        return colors.warning;
      case 'Closed':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const renderLoanAccount = (account: LoanAccount, index: number) => {
    // Define overdue counts for the three cards
    const overdueCounts = [0, 1, 2];
    const overdueCount = overdueCounts[index] || 0;

    const handleRepaymentSchedule = () => {
      router.push('/loan/repayment');
    };

    const handleAccountStatement = () => {
      router.push(`/loan/statement/view?acct=${account.id}`);
    };

    return (
      <TouchableOpacity
        key={account.id}
        style={[styles.accountCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        onPress={() => Alert.alert('Account Details', `View details for ${account.productName}`)}
      >
        <View style={styles.accountHeader}>
          <View style={styles.accountIconContainer}>
            <View style={[styles.accountIcon, { backgroundColor: colors.primary + '20' }]}>
              <Icon icon={getAccountIcon(account.productName)} size={24} color={colors.primary} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.text }]}>
                {account.productName}
              </Text>
              <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                {account.maskedNo}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(account.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(account.status) }]}>
              {account.status}
            </Text>
          </View>
        </View>

        <View style={styles.accountDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Outstanding Balance</Text>
            <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'Poppins_600SemiBold' }]}>
              {formatCurrency(account.currentBalance)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Monthly EMI</Text>
            <Text style={[styles.detailValue, { color: colors.primary }]}>
              {formatCurrency(account.emiAmount)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Next EMI Date</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {formatDate(account.nextEmiDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Over Due Count</Text>
            <Text style={[styles.detailValue, { color: overdueCount > 0 ? colors.error : colors.text }]}>
              {overdueCount}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: '#10B981', backgroundColor: '#10B981' + '15' }]}
            onPress={handleRepaymentSchedule}
          >
            <Icon icon="Calendar" size={16} color="#10B981" />
            <Text style={[styles.actionButtonText, { color: '#10B981' }]}>
              Repayment Schedule
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.primary, backgroundColor: colors.primary + '15' }]}
            onPress={handleAccountStatement}
          >
            <Icon icon="FileText" size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Account Statement
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDepositAccount = (account: DepositAccount) => {
    const isDepositScheme = account.productName.includes('PES') || account.productName.includes('EFDS');
    
    const handleAccountStatement = () => {
      const url = `/deposit/statement/view?accountId=${account.id}&accountNumber=${account.accountNumber}&accountType=Fixed%20Deposit`;
      router.push(url);
    };

    const handleTakeLoan = () => {
      const url = `/deposit/lad?accountNumber=${account.accountNumber}&productName=${encodeURIComponent(account.productName)}`;
      router.push(url);
    };

    return (
      <TouchableOpacity
        key={account.id}
        style={[styles.accountCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        onPress={() => Alert.alert('Account Details', `View details for ${account.productName}`)}
      >
        <View style={styles.accountHeader}>
          <View style={styles.accountIconContainer}>
            <View style={[styles.accountIcon, { backgroundColor: colors.success + '20' }]}>
              <Icon icon={getAccountIcon(account.accountType)} size={24} color={colors.success} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.text }]}>
                {account.productName}
              </Text>
              <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                {account.maskedNo}
              </Text>
              {/* Display deposit details for PES and EFDS */}
              {isDepositScheme && (
                <View style={styles.depositDetails}>
                  <Text style={[styles.depositDetailText, { color: colors.textSecondary }]}>
                    Deposit: {formatCurrency(account.currentBalance)} | Tenure: {account.tenure} Months | Interest Payment: {account.interestPayment}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(account.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(account.status) }]}>
              {account.status}
            </Text>
          </View>
        </View>

        <View style={styles.accountDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Current Balance</Text>
            <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'Poppins_600SemiBold' }]}>
              {formatCurrency(account.currentBalance)}
            </Text>
          </View>
          {account.maturityAmount && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Maturity Amount</Text>
              <Text style={[styles.detailValue, { color: colors.success }]}>
                {formatCurrency(account.maturityAmount)}
              </Text>
            </View>
          )}
          {account.maturityDate && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Maturity Date</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {formatDate(account.maturityDate)}
              </Text>
            </View>
          )}
          {account.tenure && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Tenure</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {account.tenure} Months
              </Text>
            </View>
          )}
          {account.interestPayment && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Interest Payment</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {account.interestPayment}
              </Text>
            </View>
          )}
        </View>

        {/* Action buttons for deposit schemes */}
        {isDepositScheme && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}
              onPress={handleAccountStatement}
            >
              <Icon icon="FileText" size={16} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Account Statement</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success + '15', borderColor: colors.success }]}
              onPress={handleTakeLoan}
            >
              <Icon icon="CreditCard" size={16} color={colors.success} />
              <Text style={[styles.actionButtonText, { color: colors.success }]}>Take Loan (LAD)</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getFilteredAccounts = () => {
    switch (activeTab) {
      case 'deposits':
        return { deposits: depositAccounts, loans: [] };
      case 'loans':
        return { deposits: [], loans: loanAccounts };
      default:
        return { deposits: depositAccounts, loans: loanAccounts };
    }
  };

  const { deposits, loans } = getFilteredAccounts();
  const totalBalance = deposits.reduce((sum, acc) => sum + acc.currentBalance, 0) + 
                      loans.reduce((sum, acc) => sum + acc.currentBalance, 0);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2 }]}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Icon icon="ArrowLeft" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#ffffff' }]}>My Accounts</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'all', label: 'All Accounts', count: deposits.length + loans.length },
          { key: 'deposits', label: 'Deposits', count: depositAccounts.length },
          { key: 'loans', label: 'Loans', count: loanAccounts.length },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === tab.key ? colors.primary : 'transparent',
                borderColor: colors.border,
              },
            ]}
            onPress={() => setActiveTab(tab.key as AccountTab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.key ? '#fff' : colors.textSecondary,
                  fontFamily: activeTab === tab.key ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
                },
              ]}
            >
              {tab.label}
            </Text>
            <Text
              style={[
                styles.tabCount,
                {
                  color: activeTab === tab.key ? '#fff' : colors.textSecondary,
                },
              ]}
            >
              {tab.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Round T Button - Only visible when not on All Accounts tab */}
      {activeTab !== 'all' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.roundTButton, { borderColor: colors.primary, backgroundColor: '#ffffff' }]}
            onPress={() => {
              if (activeTab === 'loans') {
                navigateToLoanTaxCertificate();
              } else if (activeTab === 'deposits') {
                navigateToDepositTaxCertificate();
              }
            }}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>T</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Accounts List */}
      <ScrollView
        style={styles.accountsList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {deposits.length > 0 && (
          <View style={styles.section}>
            {activeTab === 'all' && (
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Deposit Accounts</Text>
            )}
            

            
            {deposits.map(renderDepositAccount)}
          </View>
        )}

        {loans.length > 0 && (
          <View style={styles.section}>
            {activeTab === 'all' && (
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Loan Accounts</Text>
            )}
            

            
            {loans.map((account, index) => renderLoanAccount(account, index))}
          </View>
        )}

        {deposits.length === 0 && loans.length === 0 && (
          <View style={styles.emptyState}>
            <Icon icon="Inbox" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Accounts Found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {activeTab === 'deposits'
                ? 'You don\'t have any deposit accounts yet.'
                : activeTab === 'loans'
                ? 'You don\'t have any loan accounts yet.'
                : 'You don\'t have any accounts yet.'}
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  headerBackButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    marginTop: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginBottom: 1,
    fontFamily: 'Poppins_500Medium',
  },
  tabCount: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
  },
  accountsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100, // Add bottom padding to prevent overlap with footer
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  accountCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  accountIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  accountNumber: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
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
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  detailValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
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
  depositDetails: {
    marginTop: 4,
  },
  depositDetailText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },
  taxCertificateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  taxCertificateButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#ffffff',
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
  },
  roundTButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    fontWeight: '600',
  },
});