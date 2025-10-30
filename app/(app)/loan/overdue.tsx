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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../../components/ui/Icon';

interface OverdueAccount {
  id: string;
  accountNumber: string;
  accountType: 'Personal Loan' | 'Home Loan' | 'Car Loan' | 'Business Loan';
  overdueAmount: number;
  daysPastDue: number;
  lastPaymentDate: string;
  nextDueDate: string;
  principalAmount: number;
  interestAmount: number;
  penaltyAmount: number;
}

interface OverdueData {
  totalOverdueAccounts: number;
  totalOverdueAmount: number;
  accounts: OverdueAccount[];
}

// Mock API function
const getOverdueAccounts = async (): Promise<OverdueData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    totalOverdueAccounts: 2,
    totalOverdueAmount: 125000,
    accounts: [
      {
        id: '1',
        accountNumber: 'PL-2024-001234',
        accountType: 'Personal Loan',
        overdueAmount: 75000,
        daysPastDue: 15,
        lastPaymentDate: '2024-12-01',
        nextDueDate: '2024-12-15',
        principalAmount: 50000,
        interestAmount: 20000,
        penaltyAmount: 5000,
      },
      {
        id: '2',
        accountNumber: 'HL-2024-005678',
        accountType: 'Home Loan',
        overdueAmount: 50000,
        daysPastDue: 8,
        lastPaymentDate: '2024-11-20',
        nextDueDate: '2024-12-20',
        principalAmount: 35000,
        interestAmount: 12000,
        penaltyAmount: 3000,
      },
    ],
  };
};

export default function OverdueCountScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overdueData, setOverdueData] = useState<OverdueData | null>(null);

  useEffect(() => {
    loadOverdueData();
  }, []);

  const loadOverdueData = async () => {
    try {
      setLoading(true);
      const data = await getOverdueAccounts();
      setOverdueData(data);
    } catch (error) {
      console.error('Error loading overdue data:', error);
      Alert.alert('Error', 'Failed to load overdue information');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOverdueData();
    setRefreshing(false);
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

  const getStatusColor = (daysPastDue: number): string => {
    if (daysPastDue <= 7) return '#F59E0B'; // Yellow for 1-7 days
    if (daysPastDue <= 30) return '#EF4444'; // Red for 8-30 days
    return '#7C2D12'; // Dark red for 30+ days
  };

  const getStatusText = (daysPastDue: number): string => {
    if (daysPastDue <= 7) return 'Recently Overdue';
    if (daysPastDue <= 30) return 'Overdue';
    return 'Severely Overdue';
  };

  const handleAccountPress = (account: OverdueAccount) => {
    // Navigate to account details or payment screen
    Alert.alert(
      'Account Action',
      `What would you like to do with account ${account.accountNumber}?`,
      [
        { text: 'View Details', onPress: () => console.log('View details') },
        { text: 'Make Payment', onPress: () => console.log('Make payment') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2, paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/dashboard')}
        >
          <Icon icon="ArrowLeft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#fff' }]}>
          Overdue Count
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primaryNavy2]}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryNavy2} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading overdue information...
            </Text>
          </View>
        ) : overdueData ? (
          <>
            {/* Summary Card */}
            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
              <View style={styles.summaryHeader}>
                <Icon icon="AlertTriangle" size={24} color="#EF4444" />
                <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
                  Overdue Summary
                </Text>
              </View>
              
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                    Total Overdue Accounts
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                    {overdueData.totalOverdueAccounts}
                  </Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                    Total Overdue Amount
                  </Text>
                  <Text style={[styles.summaryValue, { color: '#EF4444' }]}>
                    {formatCurrency(overdueData.totalOverdueAmount)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Overdue Accounts List */}
            {overdueData.accounts.length > 0 ? (
              <View style={[styles.accountsCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Overdue Accounts
                </Text>
                
                {overdueData.accounts.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[styles.accountItem, { borderBottomColor: colors.border }]}
                    onPress={() => handleAccountPress(account)}
                  >
                    <View style={styles.accountHeader}>
                      <View style={styles.accountInfo}>
                        <Text style={[styles.accountNumber, { color: colors.textPrimary }]}>
                          {account.accountNumber}
                        </Text>
                        <Text style={[styles.accountType, { color: colors.textSecondary }]}>
                          {account.accountType}
                        </Text>
                      </View>
                      
                      <View style={styles.statusContainer}>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(account.daysPastDue) + '20' }
                        ]}>
                          <Text style={[
                            styles.statusText,
                            { color: getStatusColor(account.daysPastDue) }
                          ]}>
                            {account.daysPastDue} days overdue
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <View style={styles.accountDetails}>
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                          Overdue Amount:
                        </Text>
                        <Text style={[styles.detailValue, { color: '#EF4444' }]}>
                          {formatCurrency(account.overdueAmount)}
                        </Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                          Last Payment:
                        </Text>
                        <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                          {formatDate(account.lastPaymentDate)}
                        </Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                          Next Due Date:
                        </Text>
                        <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                          {formatDate(account.nextDueDate)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.amountBreakdown}>
                      <View style={styles.breakdownRow}>
                        <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                          Principal: {formatCurrency(account.principalAmount)}
                        </Text>
                        <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                          Interest: {formatCurrency(account.interestAmount)}
                        </Text>
                        <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                          Penalty: {formatCurrency(account.penaltyAmount)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.chevronContainer}>
                      <Icon icon="ChevronRight" size={20} color={colors.textSecondary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
                <Icon icon="CheckCircle" size={48} color={colors.primaryNavy2} />
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  No Overdue Accounts
                </Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  All your loan accounts are up to date with payments.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={[styles.errorCard, { backgroundColor: colors.card }]}>
            <Icon icon="AlertCircle" size={48} color="#EF4444" />
            <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
              Unable to Load Data
            </Text>
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>
              Please check your connection and try again.
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginLeft: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  accountsCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 16,
  },
  accountItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    position: 'relative',
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
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  accountType: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  detailValue: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
  },
  amountBreakdown: {
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
  },
  chevronContainer: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  emptyCard: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorCard: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});