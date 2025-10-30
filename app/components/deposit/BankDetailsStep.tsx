import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

interface BankDetailsStepProps {
  formData: any;
  currentStepData: any;
  onNext?: (data: any) => void;
}



const bankOptions = [
  'AB Bank Limited',
  'Agrani Bank Limited',
  'Al-Arafah Islami Bank Limited',
  'Bangladesh Commerce Bank Limited',
  'Bangladesh Development Bank Limited',
  'Bangladesh Krishi Bank',
  'Bank Asia Limited',
  'BASIC Bank Limited',
  'BRAC Bank Limited',
  'City Bank Limited',
  'Commercial Bank of Ceylon Limited',
  'Community Bank Bangladesh Limited',
  'Dhaka Bank Limited',
  'Dutch-Bangla Bank Limited',
  'Eastern Bank Limited',
  'Export Import Bank of Bangladesh Limited',
  'First Security Islami Bank Limited',
  'IFIC Bank Limited',
  'Islami Bank Bangladesh Limited',
  'Jamuna Bank Limited',
  'Janata Bank Limited',
  'Meghna Bank Limited',
  'Mercantile Bank Limited',
  'Midland Bank Limited',
  'Modhumoti Bank Limited',
  'Mutual Trust Bank Limited',
  'National Bank Limited',
  'National Credit & Commerce Bank Limited',
  'NRB Bank Limited',
  'NRB Commercial Bank Limited',
  'NRB Global Bank Limited',
  'One Bank Limited',
  'Padma Bank Limited',
  'Premier Bank Limited',
  'Prime Bank Limited',
  'Pubali Bank Limited',
  'Rupali Bank Limited',
  'Shahjalal Islami Bank Limited',
  'Social Islami Bank Limited',
  'Sonali Bank Limited',
  'Southeast Bank Limited',
  'Standard Bank Limited',
  'State Bank of India',
  'The City Bank Limited',
  'Trust Bank Limited',
  'Union Bank Limited',
  'United Commercial Bank Limited',
  'Uttara Bank Limited'
];

const branchOptions = [
  'Dhanmondi Branch',
  'Gulshan Branch',
  'Banani Branch',
  'Uttara Branch',
  'Motijheel Branch',
  'Dilkusha Branch',
  'Ramna Branch',
  'Wari Branch',
  'Old Dhaka Branch',
  'New Market Branch',
  'Elephant Road Branch',
  'Panthapath Branch',
  'Farmgate Branch',
  'Tejgaon Branch',
  'Mohakhali Branch',
  'Badda Branch',
  'Rampura Branch',
  'Malibagh Branch',
  'Khilgaon Branch',
  'Bashundhara Branch',
  'Mirpur Branch',
  'Pallabi Branch',
  'Kazipara Branch',
  'Shyamoli Branch',
  'Adabar Branch',
  'Mohammadpur Branch',
  'Lalmatia Branch',
  'Jigatola Branch',
  'Hazaribagh Branch',
  'Lalbagh Branch'
];

export default function BankDetailsStep({ formData, currentStepData, onNext }: BankDetailsStepProps) {
  const { control, formState: { errors } } = useFormContext();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bank Account Details</Text>
      <Text style={styles.subtitle}>
        Provide your bank account information for maturity payment.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Account Holder Name <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="accountName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textInput, errors.accountName && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ''}
              placeholder="Enter account holder name"
            />
          )}
        />
        {errors.accountName && (
          <Text style={styles.errorText}>{errors.accountName.message as string}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Account Number <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="accountNo"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textInput, errors.accountNo && styles.inputError]}
              onBlur={onBlur}
              onChangeText={(text) => {
                // Only allow digits
                const numericValue = text.replace(/[^0-9]/g, '');
                onChange(numericValue);
              }}
              value={value || ''}
              placeholder="Enter account number"
              keyboardType="numeric"
            />
          )}
        />
        {errors.accountNo && (
          <Text style={styles.errorText}>{errors.accountNo.message as string}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Bank Name <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="bankName"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.pickerContainer, errors.bankName && styles.inputError]}>
              <Picker
                selectedValue={value || ''}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Select bank" value="" />
                {bankOptions.map((bank) => (
                  <Picker.Item 
                    key={bank} 
                    label={bank} 
                    value={bank} 
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.bankName && (
          <Text style={styles.errorText}>{errors.bankName.message as string}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Branch Name <Text style={styles.required}>*</Text>
        </Text>
        <Controller
          control={control}
          name="branchName"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.pickerContainer, errors.branchName && styles.inputError]}>
              <Picker
                selectedValue={value || ''}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Select branch" value="" />
                {branchOptions.map((branch) => (
                  <Picker.Item 
                    key={branch} 
                    label={branch} 
                    value={branch} 
                  />
                ))}
              </Picker>
            </View>
          )}
        />
        {errors.branchName && (
          <Text style={styles.errorText}>{errors.branchName.message as string}</Text>
        )}
      </View>



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
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  inputHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
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

  nextButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
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