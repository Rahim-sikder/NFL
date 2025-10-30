import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';
import { auth } from '../../../lib/auth';
import Icon from '../../components/ui/Icon';

interface LoanDetails {
  loanId: string;
  accountNumber: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  outstandingAmount: number;
  nextDueDate: string;
  loanType: string;
}

interface RepaymentSchedule {
  installmentNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  emiAmount: number;
  outstandingBalance: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

export default function RepaymentScheduleScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [repaymentSchedule, setRepaymentSchedule] = useState<RepaymentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedView, setSelectedView] = useState<'upcoming' | 'all' | 'paid'>('upcoming');

  useEffect(() => {
    loadRepaymentData();
  }, []);

  const loadRepaymentData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, this would come from API
      const mockLoanDetails: LoanDetails = {
        loanId: 'LN001234567',
        accountNumber: '1234567890',
        loanAmount: 500000,
        interestRate: 8.5,
        tenure: 60,
        emiAmount: 10253,
        outstandingAmount: 425000,
        nextDueDate: '2024-02-15',
        loanType: 'Home Loan'
      };

      const mockSchedule: RepaymentSchedule[] = [];
      const startDate = new Date('2023-02-15');
      let outstandingBalance = mockLoanDetails.loanAmount;
      
      for (let i = 1; i <= mockLoanDetails.tenure; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(startDate.getMonth() + i - 1);
        
        const interestAmount = Math.round((outstandingBalance * mockLoanDetails.interestRate / 100) / 12);
        const principalAmount = mockLoanDetails.emiAmount - interestAmount;
        outstandingBalance = Math.max(0, outstandingBalance - principalAmount);
        
        let status: 'paid' | 'pending' | 'overdue' = 'pending';
        let paidDate: string | undefined;
        
        if (i <= 15) {
          status = 'paid';
          paidDate = dueDate.toISOString().split('T')[0];
        } else if (dueDate < new Date()) {
          status = 'overdue';
        }
        
        mockSchedule.push({
          installmentNumber: i,
          dueDate: dueDate.toISOString().split('T')[0],
          principalAmount,
          interestAmount,
          emiAmount: mockLoanDetails.emiAmount,
          outstandingBalance,
          status,
          paidDate
        });
      }
      
      setLoanDetails(mockLoanDetails);
      setRepaymentSchedule(mockSchedule);
    } catch (error) {
      console.error('Error loading repayment data:', error);
      Alert.alert('Error', 'Failed to load repayment schedule');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRepaymentData();
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFilteredSchedule = (): RepaymentSchedule[] => {
    switch (selectedView) {
      case 'upcoming':
        return repaymentSchedule.filter(item => item.status === 'pending' || item.status === 'overdue').slice(0, 6);
      case 'paid':
        return repaymentSchedule.filter(item => item.status === 'paid');
      case 'all':
      default:
        return repaymentSchedule;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return '#10B981';
      case 'overdue': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'paid': return 'CheckCircle';
      case 'overdue': return 'AlertCircle';
      case 'pending': return 'Clock';
      default: return 'Clock';
    }
  };

  const handleMakePayment = () => {
    Alert.alert(
      'Make Payment',
      'This feature will redirect you to the payment gateway.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Redirect to payment') }
      ]
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.primaryNavy2, borderBottomColor: colors.border }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon icon="ArrowLeft" size="md" color="#ffffff" />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: '#ffffff' }]}>Repayment Schedule</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderLoanSummary = () => {
    if (!loanDetails) return null;
    
    return (
      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Loan Summary</Text>
          <View style={[styles.loanTypeBadge, { backgroundColor: colors.primaryNavy2 + '15' }]}>
            <Text style={[styles.loanTypeText, { color: colors.primaryNavy2 }]}>{loanDetails.loanType}</Text>
          </View>
        </View>
        
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Loan Amount</Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{formatCurrency(loanDetails.loanAmount)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Outstanding</Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{formatCurrency(loanDetails.outstandingAmount)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>EMI Amount</Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{formatCurrency(loanDetails.emiAmount)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Next Due Date</Text>
            <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{formatDate(loanDetails.nextDueDate)}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.paymentButton, { backgroundColor: colors.primaryNavy2 }]}
          onPress={handleMakePayment}
        >
          <Icon icon="CreditCard" size="sm" color="#ffffff" />
          <Text style={styles.paymentButtonText}>Make Payment</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderViewTabs = () => (
    <View style={[styles.tabContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {[{ key: 'upcoming', label: 'Upcoming' }, { key: 'paid', label: 'Paid' }].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            selectedView === tab.key && { backgroundColor: colors.primaryNavy2 }
          ]}
          onPress={() => setSelectedView(tab.key as any)}
        >
          <Text style={[
            styles.tabText,
            { color: selectedView === tab.key ? '#ffffff' : colors.textSecondary }
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTableHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: colors.primaryNavy2 }]}>
      <Text style={[styles.tableHeaderText, styles.slColumn]}>Sl</Text>
      <Text style={[styles.tableHeaderText, styles.amountColumn]}>Installment Amount</Text>
      <Text style={[styles.tableHeaderText, styles.dateColumn]}>Date</Text>
      <Text style={[styles.tableHeaderText, styles.outstandingColumn]}>Outstanding</Text>
    </View>
  );

  const renderTableRow = (item: RepaymentSchedule, index: number) => (
    <View key={index} style={[styles.tableRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={[styles.tableCellText, styles.slColumn, { color: colors.textPrimary }]}>
        {item.installmentNumber}
      </Text>
      <Text style={[styles.tableCellText, styles.amountColumn, { color: colors.primaryNavy2 }]}>
        {formatCurrency(item.emiAmount)}
      </Text>
      <Text style={[styles.tableCellText, styles.dateColumn, { color: colors.textPrimary }]}>
        {formatDate(item.dueDate)}
      </Text>
      <Text style={[styles.tableCellText, styles.outstandingColumn, { color: colors.textPrimary }]}>
        {formatCurrency(item.outstandingBalance)}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primaryNavy2} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading repayment schedule...</Text>
        </View>
      );
    }

    const filteredSchedule = getFilteredSchedule();

    return (
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primaryNavy2]}
            tintColor={colors.primaryNavy2}
          />
        }
      >
        <View style={styles.container}>
          {renderLoanSummary()}
          {renderViewTabs()}
          
          <View style={styles.scheduleContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {selectedView === 'upcoming' ? 'Upcoming Payments' : 'Payment History'}
              {filteredSchedule.length > 0 && ` (${filteredSchedule.length})`}
            </Text>
            
            {filteredSchedule.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon icon="Calendar" size="lg" color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textPrimary }]}>No payments found</Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>No payments match the selected filter</Text>
              </View>
            ) : (
              <View style={[styles.tableContainer, { backgroundColor: colors.card }]}>
                {renderTableHeader()}
                {filteredSchedule.map((item, index) => renderTableRow(item, index))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  loanTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  loanTypeText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    width: '48%',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  paymentButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  scheduleContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  tableCellText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  slColumn: {
    flex: 0.8,
  },
  amountColumn: {
    flex: 2,
  },
  dateColumn: {
    flex: 1.5,
  },
  outstandingColumn: {
    flex: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
    textAlign: 'center',
  },
});