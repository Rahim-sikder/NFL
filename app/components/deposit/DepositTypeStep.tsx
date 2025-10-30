import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

interface DepositTypeStepProps {
  formData: any;
  currentStepData: any;
  onNext?: (data: any) => void;
}

const depositCategories = [
  { label: 'Select Category', value: '' },
  { label: 'Regular Deposits', value: 'regular' },
  { label: 'Money Builder', value: 'money_builder' }
];

const depositTypes = {
  regular: [
    { label: 'Select Deposit Type', value: '' },
    { label: 'Term Deposit', value: 'term_deposit' },
    { label: 'Double Money Deposit', value: 'double_money' },
    { label: 'Triple Money Deposit', value: 'triple_money' },
    { label: 'Earn Fast Deposit Scheme (EFDS)', value: 'efds' }
  ],
  money_builder: [
    { label: 'Select Deposit Type', value: '' },
    { label: 'Monthly Deposit Scheme (MDS)', value: 'mds' },
    { label: 'Millionaire Savings Scheme (MSS)', value: 'mss' }
  ]
};

export default function DepositTypeStep({ formData, currentStepData, onNext }: DepositTypeStepProps) {
  const { control, watch, formState: { errors } } = useFormContext();
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const depositCategory = watch('depositCategory');
  const depositType = watch('depositType');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset deposit type when category changes
    if (category !== depositCategory) {
      // This will be handled by the form controller
    }
  };

  const getAvailableTypes = () => {
    if (!depositCategory || depositCategory === '') {
      return [];
    }
    return depositTypes[depositCategory as keyof typeof depositTypes] || [];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Deposit Type</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Deposit Category <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="depositCategory"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.pickerContainer, errors.depositCategory && styles.inputError]}>
              <Picker
                selectedValue={value || ''}
                onValueChange={(itemValue) => {
                  onChange(itemValue);
                  handleCategoryChange(itemValue);
                  // Reset deposit type when category changes
                  if (itemValue !== value) {
                    // The depositType will be reset by the parent form
                  }
                }}
                style={styles.picker}
              >
                {depositCategories.map((category) => (
                  <Picker.Item
                    key={category.value}
                    label={category.label}
                    value={category.value}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.depositCategory && (
          <Text style={styles.errorText}>{errors.depositCategory.message as string}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Deposit Type <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="depositType"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.pickerContainer, errors.depositType && styles.inputError]}>
              <Picker
                selectedValue={value || ''}
                onValueChange={onChange}
                style={styles.picker}
                enabled={!!depositCategory && depositCategory !== ''}
              >
                {getAvailableTypes().map((type) => (
                  <Picker.Item
                    key={type.value}
                    label={type.label}
                    value={type.value}
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.depositType && (
          <Text style={styles.errorText}>{errors.depositType.message as string}</Text>
        )}
      </View>

      {/* Information section based on selected type */}
      {depositType && depositType !== '' && (
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Selected Deposit Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category:</Text>
            <Text style={styles.infoValue}>
              {depositCategories.find(c => c.value === depositCategory)?.label}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>
              {getAvailableTypes().find(t => t.value === depositType)?.label}
            </Text>
          </View>
        </View>
      )}

      {/* Next Button */}
      {depositCategory && depositType && depositCategory !== '' && depositType !== '' && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => onNext && onNext({ depositCategory, depositType })}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  infoSection: {
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
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  nextButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
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
});