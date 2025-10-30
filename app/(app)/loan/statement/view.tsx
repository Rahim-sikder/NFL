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
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import Icon from '../../../components/ui/Icon';
import { getLoanStatement, exportStatementPDF } from '../../../../lib/api';

interface StatementTransaction {
  id: string;
  date: string;
  description: string;
  debitAmount?: number;
  creditAmount?: number;
  balance: number;
  transactionType: 'EMI Payment' | 'Interest Charge' | 'Late Fee' | 'Principal Payment' | 'Loan Disbursement';
}

interface LoanStatement {
  accountId: string;
  accountNumber: string;
  statementPeriod: {
    from: string;
    to: string;
  };
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  transactions: StatementTransaction[];
}

export default function LoanStatementViewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { acct } = useLocalSearchParams<{ acct: string }>();

  const [statement, setStatement] = useState<LoanStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    // Set default dates (today - 30 days to today)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    setToDate(formatDateForInput(today));
    setFromDate(formatDateForInput(thirtyDaysAgo));
    
    if (acct) {
      loadStatement();
    }
  }, [acct]);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const loadStatement = async () => {
    if (!acct) return;
    
    try {
      setLoading(true);
      const statementData = await getLoanStatement({
        acct,
        from: fromDate,
        to: toDate,
      });
      setStatement(statementData);
    } catch (error) {
      console.error('Error loading statement:', error);
      Alert.alert('Error', 'Failed to load statement');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatement();
    setRefreshing(false);
  };

  const handleApplyFilters = () => {
    loadStatement();
  };

  const handleExportPDF = async () => {
    if (!acct) return;
    
    try {
      setExporting(true);
      await exportStatementPDF({
        acct,
        from: fromDate,
        to: toDate,
        kind: 'loan',
      });
      Alert.alert('Success', 'Statement exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      Alert.alert('Error', 'Failed to export statement');
    } finally {
      setExporting(false);
    }
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

  const formatDateInput = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (!acct) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.primaryNavy2, paddingTop: insets.top }]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                router.push('/dashboard');
              }}
            >
              <Icon icon="ArrowLeft" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Loan Statement</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>
            No account selected
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon icon="ArrowLeft" size={24} color="#fff" />
            </TouchableOpacity>
          <Text style={styles.headerTitle}>Loan Statement</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleExportPDF}
            disabled={exporting || !statement}
          >
            {exporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Icon icon="Download" size={24} color="#fff" />
            )}
          </TouchableOpacity>
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
        {/* Filters Section */}
        <View style={[styles.filtersCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.filtersTitle, { color: colors.textPrimary }]}>Filters</Text>
          
          <View style={styles.dateFilters}>
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>From Date</Text>
              <TextInput
                style={[styles.dateInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                value={fromDate}
                onChangeText={setFromDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            <View style={styles.dateInputContainer}>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>To Date</Text>
              <TextInput
                style={[styles.dateInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
                value={toDate}
                onChangeText={setToDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
          
          <View style={styles.filterRow}>
            <View style={[styles.staticPill, { backgroundColor: colors.primaryNavy2 + '20' }]}>
              <Text style={[styles.staticPillText, { color: colors.primaryNavy2 }]}>
                Physical transactions only
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primaryNavy2 }]}
              onPress={handleApplyFilters}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.applyButtonText}>Apply</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryNavy2} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading statement...
            </Text>
          </View>
        ) : statement ? (
          <>
            {/* Statement Header */}
            <View style={[styles.statementHeader, { backgroundColor: colors.surface }]}>
              <Text style={[styles.accountNumber, { color: colors.textPrimary }]}>
                {statement.accountNumber}
              </Text>
              <Text style={[styles.statementPeriod, { color: colors.textSecondary }]}>
                Statement Period: {formatDate(statement.statementPeriod.from)} - {formatDate(statement.statementPeriod.to)}
              </Text>
            </View>

            {/* Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Opening Balance</Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                    {formatCurrency(statement.openingBalance)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Payments</Text>
                  <Text style={[styles.summaryValue, { color: '#28a745' }]}>
                    {formatCurrency(statement.totalDebits)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Charges</Text>
                  <Text style={[styles.summaryValue, { color: '#dc3545' }]}>
                    {formatCurrency(statement.totalCredits)}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Closing Balance</Text>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                    {formatCurrency(statement.closingBalance)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Transactions Table */}
            <View style={[styles.transactionsCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.transactionsTitle, { color: colors.textPrimary }]}>Transactions</Text>
              
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { color: colors.textSecondary }]}>Date</Text>
                <Text style={[styles.tableHeaderText, { color: colors.textSecondary }]}>Description</Text>
                <Text style={[styles.tableHeaderText, { color: colors.textSecondary }]}>Debit</Text>
                <Text style={[styles.tableHeaderText, { color: colors.textSecondary }]}>Credit</Text>
                <Text style={[styles.tableHeaderTextLast, { color: colors.textSecondary }]}>Balance</Text>
              </View>
              
              {statement.transactions.length > 0 ? (
                <View style={styles.transactionsList}>
                  {statement.transactions.map((transaction) => (
                    <View
                        key={transaction.id}
                        style={styles.tableRow}
                      >
                      <Text style={[styles.tableCellDate, { color: colors.textPrimary }]}>
                        {formatDateInput(transaction.date)}
                      </Text>
                      <View style={styles.tableCellDescription}>
                        <Text style={[styles.transactionDescription, { color: colors.textPrimary }]}>
                          {transaction.description}
                        </Text>
                        <Text style={[styles.transactionType, { color: colors.textSecondary }]}>
                          {transaction.transactionType}
                        </Text>
                      </View>
                      <Text style={[styles.tableCellAmount, { color: transaction.debitAmount ? '#dc3545' : 'transparent' }]}>
                        {transaction.debitAmount ? formatCurrency(transaction.debitAmount) : '-'}
                      </Text>
                      <Text style={[styles.tableCellAmount, { color: transaction.creditAmount ? '#28a745' : 'transparent' }]}>
                        {transaction.creditAmount ? formatCurrency(transaction.creditAmount) : '-'}
                      </Text>
                      <Text style={[styles.tableCellAmountLast, { color: colors.textPrimary }]}>
                        {formatCurrency(transaction.balance)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="FileText" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
                    No Transactions Found
                  </Text>
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    No transactions found for the selected date range.
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="AlertCircle" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: colors.textPrimary }]}>
              Failed to Load Statement
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Please try again or contact support if the problem persists.
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
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
    marginTop: 5,
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
    paddingTop: 12,
    paddingBottom: 200,
    paddingHorizontal: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  filtersCard: {
    padding: 12,
    paddingLeft: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  filtersTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  dateFilters: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 4,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    minHeight: 38,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staticPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  staticPillText: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 38,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
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
  statementHeader: {
    padding: 12,
    paddingLeft: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  accountNumber: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  statementPeriod: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  summaryCard: {
    padding: 12,
    paddingLeft: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  transactionsCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 0,
    marginBottom: 12,
  },
  transactionsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderTopWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    paddingHorizontal: 8,
    color: '#374151',
  },
  transactionsList: {
    gap: 0,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tableCellDate: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    paddingHorizontal: 8,
  },
  tableCellDescription: {
    flex: 2,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    justifyContent: 'center',
  },
  transactionDescription: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 1,
  },
  transactionType: {
    fontSize: 10,
    fontFamily: 'Poppins_400Regular',
  },
  tableCellAmount: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    paddingHorizontal: 8,
  },
  tableHeaderTextLast: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    color: '#374151',
  },
  tableCellAmountLast: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});