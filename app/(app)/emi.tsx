import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/ThemeProvider';
import Icon from '../components/ui/Icon';

type TabType = 'loan' | 'deposit';

interface LoanInputs {
  amount: string;
  interestRate: string;
  period: string;
}

interface DepositInputs {
  amount: string;
  interestRate: string;
  term: string;
}

export default function EMICalculator() {
  const { colors } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('loan');
  
  // Loan form state
  const [loanInputs, setLoanInputs] = useState<LoanInputs>({
    amount: '',
    interestRate: '',
    period: '',
  });
  
  // Deposit form state
  const [depositInputs, setDepositInputs] = useState<DepositInputs>({
    amount: '',
    interestRate: '',
    term: '',
  });

  // Calculate EMI for loan
  const calculateEMI = (): string => {
    const { amount, interestRate, period } = loanInputs;
    
    if (!amount || !interestRate || !period) {
      return 'Enter all values to calculate';
    }
    
    const P = parseFloat(amount);
    const annualRate = parseFloat(interestRate);
    const n = parseFloat(period);
    
    if (P <= 0 || annualRate <= 0 || n <= 0) {
      return 'Enter valid positive values';
    }
    
    const r = annualRate / 12 / 100; // Monthly interest rate
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    return `EMI: ${emi.toFixed(2)} BDT`;
  };

  // Calculate maturity value for deposit
  const calculateMaturityValue = (): string => {
    const { amount, interestRate, term } = depositInputs;
    
    if (!amount || !interestRate || !term) {
      return 'Enter all values to calculate';
    }
    
    const P = parseFloat(amount);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(term);
    
    if (P <= 0 || r <= 0 || t <= 0) {
      return 'Enter valid positive values';
    }
    
    const maturityValue = P + (P * r * t / 12);
    
    return `Maturity Value: ${maturityValue.toFixed(2)} BDT`;
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.primaryNavy2, borderBottomColor: colors.border }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon icon="ArrowLeft" size="md" color="#ffffff" />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: "#ffffff" }]}>
        EMI Calculator
      </Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tab,
          {
            borderBottomColor: activeTab === 'loan' ? colors.primaryNavy2 : colors.border,
          },
        ]}
        onPress={() => setActiveTab('loan')}
      >
        <Icon icon="Calculator" size="sm" color={activeTab === 'loan' ? colors.primaryNavy2 : colors.textPrimary} />
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'loan' ? colors.primaryNavy2 : colors.textPrimary,
            },
          ]}
        >
          Loan EMI
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          {
            borderBottomColor: activeTab === 'deposit' ? colors.primaryNavy2 : colors.border,
          },
        ]}
        onPress={() => setActiveTab('deposit')}
      >
        <Icon icon="PiggyBank" size="sm" color={activeTab === 'deposit' ? colors.primaryNavy2 : colors.textPrimary} />
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === 'deposit' ? colors.primaryNavy2 : colors.textPrimary,
            },
          ]}
        >
          Deposit Calculator
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoanForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Loan Amount (BDT)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.card }]}
          placeholder="Enter loan amount"
          placeholderTextColor={colors.textPrimary + '80'}
          value={loanInputs.amount}
          onChangeText={(text) => setLoanInputs({ ...loanInputs, amount: text })}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Interest Rate (% per annum)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.card }]}
          placeholder="Enter interest rate"
          placeholderTextColor={colors.textPrimary + '80'}
          value={loanInputs.interestRate}
          onChangeText={(text) => setLoanInputs({ ...loanInputs, interestRate: text })}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Loan Period (Months)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.card }]}
          placeholder="Enter loan period in months"
          placeholderTextColor={colors.textPrimary + '80'}
          value={loanInputs.period}
          onChangeText={(text) => setLoanInputs({ ...loanInputs, period: text })}
          keyboardType="numeric"
        />
      </View>
      
      <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Icon icon="Calculator" size="md" color={colors.primaryNavy2} />
        <Text style={[styles.resultText, { color: colors.textPrimary }]}>
          {calculateEMI()}
        </Text>
      </View>
    </View>
  );

  const renderDepositForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Deposit Amount (BDT)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.card }]}
          placeholder="Enter deposit amount"
          placeholderTextColor={colors.textPrimary + '80'}
          value={depositInputs.amount}
          onChangeText={(text) => setDepositInputs({ ...depositInputs, amount: text })}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Interest Rate (% per annum)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.card }]}
          placeholder="Enter interest rate"
          placeholderTextColor={colors.textPrimary + '80'}
          value={depositInputs.interestRate}
          onChangeText={(text) => setDepositInputs({ ...depositInputs, interestRate: text })}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Term (Months)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.card }]}
          placeholder="Enter term in months"
          placeholderTextColor={colors.textPrimary + '80'}
          value={depositInputs.term}
          onChangeText={(text) => setDepositInputs({ ...depositInputs, term: text })}
          keyboardType="numeric"
        />
      </View>
      
      <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Icon icon="PiggyBank" size="md" color={colors.primaryNavy2} />
        <Text style={[styles.resultText, { color: colors.textPrimary }]}>
          {calculateMaturityValue()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {renderHeader()}
      {renderTabBar()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'loan' ? renderLoanForm() : renderDepositForm()}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  resultCard: {
    marginTop: 17,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
});