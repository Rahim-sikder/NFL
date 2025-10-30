import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { getInterestRates, InterestRate } from '../../../lib/api';

interface DepositDetailsStepProps {
  formData: any;
  currentStepData: any;
  onNext?: (data: any) => void;
}

const occupationOptions = [
  'Business',
  'Service',
  'Agriculture',
  'Student',
  'Housewife',
  'Retired',
  'Professional',
  'Other'
];

export default function DepositDetailsStep({ formData, currentStepData, onNext }: DepositDetailsStepProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const [interestRates, setInterestRates] = useState<InterestRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  
  const depositAmount = watch('depositAmount');
  const depositTerm = watch('depositTerm');
  const depositType = watch('depositType');
  const depositCategory = watch('depositCategory');
  const monthlyInstallment = watch('monthlyInstallment');

  console.log('DepositDetailsStep - depositType:', depositType);
  console.log('DepositDetailsStep - depositCategory:', depositCategory);
  console.log('DepositDetailsStep - formData:', formData);

  useEffect(() => {
    loadInterestRates();
  }, []);

  // Effect to handle conditional field updates based on deposit type
  useEffect(() => {
    if (depositType) {
      handleDepositTypeChange(depositType);
    }
  }, [depositType]);

  const handleDepositTypeChange = (type: string) => {
    switch (type) {
      case 'double_money':
        setValue('depositAmount', 100000);
        setValue('depositTerm', 60); // 5 years in months
        break;
      case 'triple_money':
        setValue('depositAmount', 100000);
        setValue('depositTerm', 120); // 10 years in months
        break;
      case 'efds':
        setValue('depositAmount', 100000);
        // Don't set term here, let user choose from available options
        break;
      default:
        // For MDS and other types, don't set fixed values
        break;
    }
  };

  const loadInterestRates = async () => {
    try {
      const rates = await getInterestRates();
      setInterestRates(rates);
    } catch (error) {
      console.error('Error loading interest rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMaturity = (amount: number, term: number, rate: number): number => {
    if (!amount || !term || !rate) return 0;
    // Simple interest calculation: maturity = amount + amount * (rate/100) * (term/12)
    return amount + (amount * (rate / 100) * (term / 12));
  };

  const getCurrentRate = (): number => {
    const rate = interestRates.find(r => r.termMonths === depositTerm);
    return rate ? rate.rate : 0;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get available deposit amounts based on deposit type
  const getAvailableAmounts = () => {
    switch (depositType) {
      case 'mds':
        return [1000, 2000, 3000, 5000, 10000, 15000, 20000];
      default:
        return [];
    }
  };

  // Get available deposit terms based on deposit type
  const getAvailableTerms = () => {
    switch (depositType) {
      case 'efds':
        return [12, 24, 24, 36, 48, 60, 72, 84]; // 12, 24 months and 2-7 years
      case 'mds':
        return [12, 24, 36, 60, 120]; // 1, 2, 3, 5, 10 years in months
      default:
        return interestRates.map(rate => rate.termMonths);
    }
  };

  // Get monthly installment for EFDS based on term
  const getMonthlyInstallment = (termYears: number): number => {
    const installments: { [key: number]: number } = {
      2: 39959,
      3: 23242,
      4: 16435,
      5: 12390,
      6: 9727,
      7: 7852
    };
    return installments[termYears] || 0;
  };

  // Check if field should be read-only
  const isFieldReadOnly = (fieldName: string): boolean => {
    switch (depositType) {
      case 'double_money':
      case 'triple_money':
      case 'efds':
        return fieldName === 'depositAmount' || fieldName === 'depositTerm';
      default:
        return false;
    }
  };

  const currentRate = getCurrentRate();
  const maturityAmount = calculateMaturity(depositAmount || 0, depositTerm || 0, currentRate);
  const interestEarned = maturityAmount - (depositAmount || 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Deposit Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Deposit Amount (BDT) <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="depositAmount"
          render={({ field: { onChange, onBlur, value } }) => {
            const availableAmounts = getAvailableAmounts();
            const isReadOnly = isFieldReadOnly('depositAmount');
            
            if (depositType === 'mds' && availableAmounts.length > 0) {
              // Show dropdown for MDS
              return (
                <View style={[styles.pickerContainer, errors.depositAmount && styles.inputError]}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select amount" value={0} />
                    {availableAmounts.map((amount) => (
                      <Picker.Item 
                        key={amount} 
                        label={`${amount.toLocaleString()} BDT`} 
                        value={amount} 
                      />
                    ))}
                  </Picker>
                </View>
              );
            } else {
              // Show text input (read-only for fixed amounts)
              return (
                <TextInput
                  style={[
                    styles.textInput, 
                    errors.depositAmount && styles.inputError,
                    isReadOnly && styles.readOnlyInput
                  ]}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    if (!isReadOnly) {
                      const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                      onChange(isNaN(numericValue) ? 0 : numericValue);
                    }
                  }}
                  value={value ? value.toLocaleString() : ''}
                  placeholder="Enter deposit amount"
                  keyboardType="numeric"
                  editable={!isReadOnly}
                />
              );
            }
          }}
        />
        {errors.depositAmount && (
          <Text style={styles.errorText}>{errors.depositAmount.message as string}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Deposit Term ({depositType === 'efds' && depositTerm && depositTerm > 24 ? 'Years' : 'Months'}) <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="depositTerm"
          render={({ field: { onChange, value } }) => {
            const availableTerms = getAvailableTerms();
            const isReadOnly = isFieldReadOnly('depositTerm');
            
            return (
              <View style={[styles.pickerContainer, errors.depositTerm && styles.inputError]}>
                <Picker
                  selectedValue={value}
                  onValueChange={(selectedValue) => {
                    onChange(selectedValue);
                    // For EFDS with yearly terms, calculate monthly installment
                    if (depositType === 'efds' && selectedValue > 24) {
                      const termYears = selectedValue / 12;
                      const installment = getMonthlyInstallment(termYears);
                      setValue('monthlyInstallment', installment);
                    }
                  }}
                  style={styles.picker}
                  enabled={!isReadOnly}
                >
                  <Picker.Item label="Select term" value={0} />
                  {availableTerms.map((term) => {
                    let label = '';
                    if (depositType === 'efds' && term <= 24) {
                      label = `${term} months`;
                    } else if (depositType === 'efds' && term > 24) {
                      label = `${term / 12} years`;
                    } else if (depositType === 'mds') {
                      const years = term / 12;
                      label = years >= 1 ? `${years} year${years > 1 ? 's' : ''}` : `${term} months`;
                    } else {
                      label = `${term} months`;
                    }
                    
                    return (
                      <Picker.Item 
                        key={term} 
                        label={label} 
                        value={term} 
                      />
                    );
                  })}
                </Picker>
              </View>
            );
          }}
        />
        {errors.depositTerm && (
          <Text style={styles.errorText}>{errors.depositTerm.message as string}</Text>
        )}
      </View>

      {/* Monthly Installment Field for EFDS */}
      {depositType === 'efds' && depositTerm && depositTerm > 24 && monthlyInstallment && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Monthly Installment (BDT) <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="monthlyInstallment"
            render={({ field: { value } }) => (
              <TextInput
                style={[styles.textInput, styles.readOnlyInput]}
                value={value ? value.toLocaleString() : ''}
                placeholder="Monthly installment"
                editable={false}
              />
            )}
          />
        </View>
      )}

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => {
            if (onNext) {
              onNext({});
            }
          }}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {depositAmount && depositTerm && currentRate > 0 && (
        <View style={styles.maturityPreview}>
          <Text style={styles.maturityTitle}>Maturity Preview</Text>
          <View style={styles.maturityRow}>
            <Text style={styles.maturityLabel}>Principal Amount:</Text>
            <Text style={styles.maturityValue}>{formatCurrency(depositAmount)}</Text>
          </View>
          <View style={styles.maturityRow}>
            <Text style={styles.maturityLabel}>Interest Rate:</Text>
            <Text style={styles.maturityValue}>{currentRate}%</Text>
          </View>
          <View style={styles.maturityRow}>
            <Text style={styles.maturityLabel}>Term:</Text>
            <Text style={styles.maturityValue}>{depositTerm} months</Text>
          </View>
          <View style={styles.maturityRow}>
            <Text style={styles.maturityLabel}>Interest Earned:</Text>
            <Text style={styles.maturityValue}>{formatCurrency(interestEarned)}</Text>
          </View>
          <View style={[styles.maturityRow, styles.maturityTotal]}>
            <Text style={styles.maturityTotalLabel}>Maturity Amount:</Text>
            <Text style={styles.maturityTotalValue}>{formatCurrency(maturityAmount)}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  readOnlyInput: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
  },
  nextButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#f28a1b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 80,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  maturityPreview: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  maturityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  maturityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  maturityLabel: {
    fontSize: 14,
    color: '#666',
  },
  maturityValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  maturityTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  maturityTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  maturityTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});