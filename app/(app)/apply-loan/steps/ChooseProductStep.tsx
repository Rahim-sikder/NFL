import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../theme/ThemeProvider';
import Icon from '../../../components/ui/Icon';
import { Picker } from '@react-native-picker/picker';

const schema = z.object({
  loanType: z.enum(['Personal', 'Auto', 'Home'], {
    required_error: 'Please select a loan type',
  }),
  homeLoanSubType: z.string().optional(),
  autoLoanSubType: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<FormData>;
  onDataChange: (data: FormData, isValid: boolean) => void;
}

const loanTypes = [
  {
    value: 'Home',
    label: 'Home Loan',
    icon: 'Home',
    info: 'National Finance Ltd. is a full-fledged Non-Banking Financial Institution (NBFI), provides home loan for-\n*Purchasing Apartment/Residential house /Commercial Space\n*Construction of Building/Apartment\n*Renovation of Apartment/Building',
  },
  {
    value: 'Auto',
    label: 'Auto Loan',
    icon: 'Car',
    info: 'National Finance Ltd., a full-fledged Non-Banking Financial Institution (NBFI), provides Auto Loan to purchase brand new/reconditioned vehicles to the individuals.',
  },
  {
    value: 'Personal',
    label: 'Personal Loan',
    icon: 'User',
    info: 'National Finance Ltd., a full-fledged Non-Banking Financial Institution (NBFI), provides Personal Loan for different personal needs of a client.',
  },
];

const homeLoanOptions = [
  { label: 'Select Home Loan Type', value: '' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'House Purchase', value: 'house_purchase' },
  { label: 'Construction', value: 'construction' },
  { label: 'Plot Purchase', value: 'plot_purchase' },
  { label: 'Commercial Property', value: 'commercial_property' },
];

const autoLoanOptions = [
  { label: 'Select Auto Loan Type', value: '' },
  { label: 'Brand New', value: 'brand_new' },
  { label: 'Registered', value: 'registered' },
  { label: 'Reconditioned', value: 'reconditioned' },
];

export default function ChooseProductStep({ data, onDataChange }: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(data.loanType || null);
  const [selectedHomeLoanSubType, setSelectedHomeLoanSubType] = useState<string>(data.homeLoanSubType || '');
  const [selectedAutoLoanSubType, setSelectedAutoLoanSubType] = useState<string>(data.autoLoanSubType || '');

  const {
    control,
    watch,
    formState: { isValid },
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      loanType: data.loanType,
      homeLoanSubType: data.homeLoanSubType,
      autoLoanSubType: data.autoLoanSubType,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const isFormValid = selectedLoanType && 
      (selectedLoanType === 'Personal' || 
       (selectedLoanType === 'Home' && selectedHomeLoanSubType) ||
       (selectedLoanType === 'Auto' && selectedAutoLoanSubType));
    
    if (isFormValid) {
      onDataChange({
        loanType: selectedLoanType as any,
        homeLoanSubType: selectedHomeLoanSubType,
        autoLoanSubType: selectedAutoLoanSubType,
      }, true);
    } else {
      onDataChange({
        loanType: selectedLoanType as any,
        homeLoanSubType: selectedHomeLoanSubType,
        autoLoanSubType: selectedAutoLoanSubType,
      }, false);
    }
  }, [selectedLoanType, selectedHomeLoanSubType, selectedAutoLoanSubType, onDataChange]);

  const handleLoanTypeSelect = (value: string) => {
    setSelectedLoanType(value);
    setValue('loanType', value as any);
    
    // Reset sub-type selections when changing loan type
    if (value !== 'Home') {
      setSelectedHomeLoanSubType('');
      setValue('homeLoanSubType', '');
    }
    if (value !== 'Auto') {
      setSelectedAutoLoanSubType('');
      setValue('autoLoanSubType', '');
    }
    
    trigger('loanType');
  };

  const selectedLoanTypeData = loanTypes.find(type => type.value === selectedLoanType);

  const canApply = selectedLoanType && 
    (selectedLoanType === 'Personal' || 
     (selectedLoanType === 'Home' && selectedHomeLoanSubType) ||
     (selectedLoanType === 'Auto' && selectedAutoLoanSubType));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        {/* Loan Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Choose Loan Type *
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textPrimary }]}>
            Select the type of loan you want to apply for
          </Text>

          <Controller
            control={control}
            name="loanType"
            render={({ field: { onChange } }) => (
              <View style={styles.loanRow}>
                {loanTypes.map((type) => {
                  const isSelected = selectedLoanType === type.value;
                  return (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.loanCard,
                        {
                          backgroundColor: colors.card,
                          borderColor: isSelected ? colors.primaryNavy2 : colors.border,
                          borderWidth: isSelected ? 2 : 1,
                        },
                      ]}
                      onPress={() => {
                        handleLoanTypeSelect(type.value);
                        onChange(type.value);
                      }}
                    >
                      <View
                        style={[
                          styles.loanIcon,
                          {
                            backgroundColor: isSelected ? colors.primaryNavy2 : colors.border,
                          },
                        ]}
                      >
                        <Icon
                          icon={type.icon}
                          size={24}
                          color={isSelected ? '#fff' : colors.textPrimary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.loanTitle,
                          {
                            color: isSelected ? colors.primaryNavy2 : colors.textPrimary,
                          },
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />

          {/* Information Display for Selected Loan Type */}
          {selectedLoanTypeData && (
            <View
              style={[
                styles.infoCard,
                {
                  backgroundColor: colors.primaryNavy2 + '10',
                  borderColor: colors.primaryNavy2 + '30',
                },
              ]}
            >
              <Icon icon="Info" size={16} color={colors.primaryNavy2} />
              <Text style={[styles.infoText, { color: colors.primaryNavy2 }]}>
                {selectedLoanTypeData.info}
              </Text>
            </View>
          )}

          {/* Home Loan Sub-type Dropdown */}
          {selectedLoanType === 'Home' && (
            <View style={styles.dropdownContainer}>
              <Text style={[styles.dropdownLabel, { color: colors.textPrimary }]}>
                Home Loan Type *
              </Text>
              <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Picker
                  selectedValue={selectedHomeLoanSubType}
                  onValueChange={(itemValue) => {
                    setSelectedHomeLoanSubType(itemValue);
                    setValue('homeLoanSubType', itemValue);
                  }}
                  style={[styles.picker, { color: colors.textPrimary }]}
                >
                  {homeLoanOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={colors.textPrimary}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* Auto Loan Sub-type Dropdown */}
          {selectedLoanType === 'Auto' && (
            <View style={styles.dropdownContainer}>
              <Text style={[styles.dropdownLabel, { color: colors.textPrimary }]}>
                Auto Loan Type *
              </Text>
              <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Picker
                  selectedValue={selectedAutoLoanSubType}
                  onValueChange={(itemValue) => {
                    setSelectedAutoLoanSubType(itemValue);
                    setValue('autoLoanSubType', itemValue);
                  }}
                  style={[styles.picker, { color: colors.textPrimary }]}
                >
                  {autoLoanOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      color={colors.textPrimary}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </View>

        {/* Apply Button */}
        <View style={styles.applyButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.applyButton,
              {
                backgroundColor: canApply ? colors.primaryNavy2 : colors.border,
              }
            ]} 
            disabled={!canApply}
            onPress={() => {
              // Save data and navigate to next step
              if (canApply) {
                onDataChange({
                  loanType: selectedLoanType as any,
                  homeLoanSubType: selectedHomeLoanSubType,
                  autoLoanSubType: selectedAutoLoanSubType,
                }, true);
                // Navigate to step 3 (skip step 2)
                router.push('/apply-loan/3');
              }
            }}
          >
            <Text style={[
              styles.applyButtonText,
              {
                color: canApply ? colors.textOnPrimary : colors.textSecondary,
              }
            ]}>Apply</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  sectionDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  loanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loanCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  loanIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  loanTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
  },
  infoText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  applyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  applyButtonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  dropdownContainer: {
    marginTop: 16,
  },
  dropdownLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
});