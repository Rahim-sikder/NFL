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
import { useTheme } from '../theme/ThemeProvider';
import { Icon } from '../components/ui/Icon';

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
          Loan
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
          Deposit
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoanForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Amount BDT TK"
        placeholderTextColor={colors.textPrimary + '80'}
        value={loanInputs.amount}
        onChangeText={(text) => setLoanInputs({ ...loanInputs, amount: text })}
        keyboardType="numeric"
      />
      
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Interest Rate % p.a."
        placeholderTextColor={colors.textPrimary + '80'}
        value={loanInputs.interestRate}
        onChangeText={(text) => setLoanInputs({ ...loanInputs, interestRate: text })}
        keyboardType="numeric"
      />
      
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Loan Period (Months)"
        placeholderTextColor={colors.textPrimary + '80'}
        value={loanInputs.period}
        onChangeText={(text) => setLoanInputs({ ...loanInputs, period: text })}
        keyboardType="numeric"
      />
      
      <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.resultText, { color: colors.textPrimary }]}>
          {calculateEMI()}
        </Text>
      </View>
    </View>
  );

  const renderDepositForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Deposit Amount"
        placeholderTextColor={colors.textPrimary + '80'}
        value={depositInputs.amount}
        onChangeText={(text) => setDepositInputs({ ...depositInputs, amount: text })}
        keyboardType="numeric"
      />
      
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Interest Rate % p.a."
        placeholderTextColor={colors.textPrimary + '80'}
        value={depositInputs.interestRate}
        onChangeText={(text) => setDepositInputs({ ...depositInputs, interestRate: text })}
        keyboardType="numeric"
      />
      
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Term (Months)"
        placeholderTextColor={colors.textPrimary + '80'}
        value={depositInputs.term}
        onChangeText={(text) => setDepositInputs({ ...depositInputs, term: text })}
        keyboardType="numeric"
      />
      
      <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.resultText, { color: colors.textPrimary }]}>
          {calculateMaturityValue()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
        EMI Calculator
      </Text>
      
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
  pageTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginVertical: 16,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
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
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  resultCard: {
    marginTop: 16,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});