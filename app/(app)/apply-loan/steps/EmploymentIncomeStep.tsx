import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme/ThemeProvider';
import { Picker } from '@react-native-picker/picker';

// New simplified schema for Step 3
const employmentIncomeSchema = z.object({
  employmentSector: z.string().min(1, 'Employment sector is required'),
  monthlyIncome: z.number().positive('Monthly income must be positive'),
  employmentType: z.string().min(1, 'Employment type is required'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

type FormData = z.infer<typeof employmentIncomeSchema>;

interface Props {
  data: Partial<FormData>;
  onDataChange: (data: FormData, isValid: boolean) => void;
}

// CBS Sector options (Employment Sectors)
const employmentSectors = [
  { value: 'Agriculture, forestry and fishing', label: 'Agriculture, forestry and fishing' },
  { value: 'Mining and quarrying', label: 'Mining and quarrying' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Electricity, gas, steam and air conditioning supply', label: 'Electricity, gas, steam and air conditioning supply' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Transportation and storage', label: 'Transportation and storage' },
  { value: 'Accommodation and food service activities', label: 'Accommodation and food service activities' },
  { value: 'Information and communication', label: 'Information and communication' },
  { value: 'Financial and insurance activities', label: 'Financial and insurance activities' },
  { value: 'Real estate activities', label: 'Real estate activities' },
  { value: 'Professional, scientific and technical activities', label: 'Professional, scientific and technical activities' },
  { value: 'Administrative and support service activities', label: 'Administrative and support service activities' },
  { value: 'Education', label: 'Education' },
  { value: 'Human health and social work activities', label: 'Human health and social work activities' },
  { value: 'Arts, entertainment and recreation', label: 'Arts, entertainment and recreation' },
  { value: 'Other service activities', label: 'Other service activities' },
  { value: 'Activities of households as employers', label: 'Activities of households as employers' },
];

// Employment type options
const employmentTypes = [
  { value: 'Self Employed', label: 'Self Employed' },
  { value: 'Service', label: 'Service' },
  { value: 'Business', label: 'Business' },
];

// Location options
const locations = [
  { value: 'Dhaka', label: 'Dhaka' },
  { value: 'Chittagong', label: 'Chittagong' },
];

export default function EmploymentIncomeStep({ data, onDataChange }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(employmentIncomeSchema),
    defaultValues: {
      employmentSector: '',
      monthlyIncome: '',
      employmentType: '',
      location: '',
      address: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isValid) {
      onDataChange(watchedValues, true);
    } else {
      onDataChange(watchedValues, false);
    }
  }, [watchedValues, isValid, onDataChange]);



  const renderInput = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    required = false,
    keyboardType: any = 'default'
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: errors[name] ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={keyboardType === 'numeric' ? value?.toString() || '' : value || ''}
            onChangeText={(text) => {
              if (keyboardType === 'numeric') {
                const numValue = parseFloat(text) || 0;
                onChange(numValue);
              } else {
                onChange(text);
              }
            }}
            onBlur={onBlur}
            keyboardType={keyboardType}
          />
        )}
      />
      {errors[name] && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errors[name]?.message}
        </Text>
      )}
    </View>
  );



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Please provide your employment and address details.
        </Text>

        {/* Employment Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Employment Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Employment Sector <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="employmentSector"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.pickerContainer, errors.employmentSector && styles.inputError]}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Employment Sector" value="" />
                    {employmentSectors.map((sector) => (
                      <Picker.Item 
                        key={sector.value} 
                        label={sector.label} 
                        value={sector.value} 
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
            {errors.employmentSector && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.employmentSector.message}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Monthly Income <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="monthlyIncome"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value?.toString() || ''}
                  onChangeText={(text) => {
                    const numValue = parseFloat(text) || 0;
                    onChange(numValue);
                  }}
                  placeholder="Enter monthly income"
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: errors.monthlyIncome ? colors.error : colors.border,
                      color: colors.text,
                    },
                  ]}
                />
              )}
            />
            {errors.monthlyIncome && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.monthlyIncome.message}
              </Text>
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Employment Type <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="employmentType"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.pickerContainer, errors.employmentType && styles.inputError]}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Employment Type" value="" />
                    {employmentTypes.map((type) => (
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
            {errors.employmentType && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.employmentType.message}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Location <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <View style={[styles.pickerContainer, errors.location && styles.inputError]}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Location" value="" />
                    {locations.map((location) => (
                      <Picker.Item 
                        key={location.value} 
                        label={location.label} 
                        value={location.value} 
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
            {errors.location && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.location.message}
              </Text>
            )}
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Address Information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Address <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: errors.address ? colors.error : colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Enter your complete address"
                  placeholderTextColor={colors.textSecondary}
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={3}
                />
              )}
            />
            {errors.address && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.address.message}
              </Text>
            )}
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => {
              // Navigate to step 6 (Declaration and Consent Page)
              router.push('/apply-loan/6');
            }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    minHeight: 44,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    minHeight: 50,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderColor: '#ff4444',
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 4,
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