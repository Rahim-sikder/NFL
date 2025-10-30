import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import Icon from '../../../components/ui/Icon';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'Credit' | 'Debit' | 'Interest';
  amount: number;
  balance: number;
  reference: string;
}

interface FilterOptions {
  dateRange: 'all' | '1month' | '3months' | '6months' | '1year';
  transactionType: 'all' | 'credit' | 'debit' | 'interest';
}

export default function DepositStatementViewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    transactionType: 'all',
  });

  const accountNumber = params.accountNumber as string;
  const accountType = params.accountType as string;
  const accountId = params.accountId as string;

  // Mock API call to fetch transactions
  const fetchTransactions = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          date: '2024-01-15',
          description: 'Opening Deposit',
          type: 'Credit',
          amount: 500000,
          balance: 500000,
          reference: 'TXN001234567890',
        },
        {
          id: '2',
          date: '2024-01-31',
          description: 'Interest Credit',
          type: 'Interest',
          amount: 3125,
          balance: 503125,
          reference: 'INT001234567891',
        },
        {
          id: '3',
          date: '2024-02-28',
          description: 'Interest Credit',
          type: 'Interest',
          amount: 3144,
          balance: 506269,
          reference: 'INT001234567892',
        },
        {
          id: '4',
          date: '2024-03-15',
          description: 'Partial Withdrawal',
          type: 'Debit',
          amount: 50000,
          balance: 456269,
          reference: 'TXN001234567893',
        },
        {
          id: '5',
          date: '2024-03-31',
          description: 'Interest Credit',
          type: 'Interest',
          amount: 2851,
          balance: 459120,
          reference: 'INT001234567894',
        },
        {
          id: '6',
          date: '2024-04-30',
          description: 'Interest Credit',
          type: 'Interest',
          amount: 2870,
          balance: 461990,
          reference: 'INT001234567895',
        },
      ];
      
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch transaction history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case '1year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) >= cutoffDate
      );
    }

    // Apply transaction type filter
    if (filters.transactionType !== 'all') {
      filtered = filtered.filter(transaction => {
        switch (filters.transactionType) {
          case 'credit':
            return transaction.type === 'Credit';
          case 'debit':
            return transaction.type === 'Debit';
          case 'interest':
            return transaction.type === 'Interest';
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = async () => {
    try {
      // Generate CSV content
      const csvHeader = 'Date,Description,Type,Amount,Balance,Reference\n';
      const csvContent = filteredTransactions.map(transaction => 
        `${transaction.date},"${transaction.description}",${transaction.type},${transaction.amount},${transaction.balance},${transaction.reference}`
      ).join('\n');
      
      const csvData = csvHeader + csvContent;
      
      // Create file
      const fileName = `deposit_statement_${accountNumber}_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Success', `Statement exported to ${fileName}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export statement');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Credit':
        return 'ArrowDownLeft';
      case 'Debit':
        return 'ArrowUpRight';
      case 'Interest':
        return 'TrendingUp';
      default:
        return 'ArrowRight';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'Credit':
        return colors.success;
      case 'Debit':
        return colors.error;
      case 'Interest':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const renderTransaction = (transaction: Transaction) => (
    <View key={transaction.id} style={[styles.transactionCard, { backgroundColor: colors.surface }]}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <View style={styles.transactionTitleRow}>
            <Icon
              name={getTransactionIcon(transaction.type)}
              size={16}
              color={getTransactionColor(transaction.type)}
              style={styles.transactionIcon}
            />
            <Text style={[styles.transactionDescription, { color: colors.text }]}>
              {transaction.description}
            </Text>
          </View>
          <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
            {new Date(transaction.date).toLocaleDateString('en-GB')}
          </Text>
          <Text style={[styles.transactionReference, { color: colors.textSecondary }]}>
            Ref: {transaction.reference}
          </Text>
        </View>
        <View style={styles.transactionAmounts}>
          <Text style={[styles.transactionAmount, { color: getTransactionColor(transaction.type) }]}>
            {transaction.type === 'Debit' ? '-' : '+'}{formatCurrency(transaction.amount)}
          </Text>
          <Text style={[styles.transactionBalance, { color: colors.textSecondary }]}>
            Bal: {formatCurrency(transaction.balance)}
          </Text>
        </View>
      </View>
    </View>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Transactions</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="X" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Date Range</Text>
            {['all', '1month', '3months', '6months', '1year'].map((range) => (
              <TouchableOpacity
                key={range}
                style={styles.filterOption}
                onPress={() => setFilters(prev => ({ ...prev, dateRange: range as any }))}
              >
                <View style={[styles.radio, filters.dateRange === range && { backgroundColor: colors.primary }]} />
                <Text style={[styles.filterOptionText, { color: colors.text }]}>
                  {range === 'all' ? 'All Time' : 
                   range === '1month' ? 'Last 1 Month' :
                   range === '3months' ? 'Last 3 Months' :
                   range === '6months' ? 'Last 6 Months' : 'Last 1 Year'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Transaction Type</Text>
            {['all', 'credit', 'debit', 'interest'].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.filterOption}
                onPress={() => setFilters(prev => ({ ...prev, transactionType: type as any }))}
              >
                <View style={[styles.radio, filters.transactionType === type && { backgroundColor: colors.primary }]} />
                <Text style={[styles.filterOptionText, { color: colors.text }]}>
                  {type === 'all' ? 'All Types' : 
                   type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - Matching My Accounts Style */}
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2 }]}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Icon icon="ArrowLeft" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#ffffff' }]}>Earn First Deposit Scheme (EFDS)</Text>
      </View>

      {/* Account Number Section */}
      <View style={[styles.accountSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.accountNumber, { color: colors.text }]}>
          Account No. {accountNumber}
        </Text>
        <TouchableOpacity
          style={styles.downloadIcon}
          onPress={handleExport}
        >
          <Icon icon="Download" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={[styles.filterBar, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.filterButton, { borderColor: colors.border }]}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="Filter" size={16} color={colors.text} />
          <Text style={[styles.filterButtonText, { color: colors.text }]}>Filter</Text>
        </TouchableOpacity>
        
        <View style={styles.filterRightSection}>
          <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Icon name="Download" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading transactions...</Text>
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="FileText" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Transactions</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              No transactions found for the selected filters.
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {filteredTransactions.map(renderTransaction)}
          </View>
        )}
      </ScrollView>

      <FilterModal />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  headerBackButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18, // Reduced by 0.75rem (from 20 to 18)
    color: '#FFFFFF',
  },
  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  accountNumber: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18, // 2rem larger (increased from 14 to 18)
    fontWeight: 'bold',
    flex: 1,
  },
  downloadIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  filterButtonText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginLeft: 6,
  },
  filterRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultCount: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  exportButton: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
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
  transactionsList: {
    flex: 1,
  },
  transactionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionIcon: {
    marginRight: 8,
  },
  transactionDescription: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    flex: 1,
  },
  transactionDate: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 2,
  },
  transactionReference: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
  },
  transactionAmounts: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  transactionBalance: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
  },
  filterOptionText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  applyButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  applyButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});