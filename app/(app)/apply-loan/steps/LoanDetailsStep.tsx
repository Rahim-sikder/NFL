import React, { useEffect } from 'react';
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

const loanDetailsSchema = z.object({
  requestedAmount: z.number().positive('Loan amount must be positive'),
  tenor: z.number().int().min(6, 'Minimum 6 months').max(84, 'Maximum 84 months'),
});

type FormData = z.infer<typeof loanDetailsSchema>;

interface Props {
  data: Partial<FormData>;
  loanType?: string;
  onDataChange: (data: FormData, isValid: boolean) => void;
}

// Get tenor limits based on loan type
const getTenorLimits = (loanType?: string) => {
  switch (loanType) {
    case 'Personal':
      return { min: 6, max: 60 };
    case 'Auto':
      return { min: 12, max: 84 };
    case 'Home':
      return { min: 60, max: 240 }; // 5-20 years
    default:
      return { min: 6, max: 84 };
  }
};

export default function LoanDetailsStep({ data, loanType, onDataChange }: Props) {
  const { colors } = useTheme();
  const router = useRouter();

  const tenorLimits = getTenorLimits(loanType);

  const {
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(loanDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      requestedAmount: data.requestedAmount || 0,
      tenor: data.tenor || tenorLimits.min,
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
    keyboardType: any = 'default',
    suffix?: string
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} {required && <Text style={{ color: colors.error }}>*</Text>}
      </Text>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                suffix ? styles.inputWithSuffix : {},
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
        {suffix && (
          <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
            {suffix}
          </Text>
        )}
      </View>
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
          Please provide your loan requirements and preferences.
        </Text>

        {/* Loan Amount and Tenor */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Loan Requirements
          </Text>

          {renderInput('requestedAmount', 'Requested Amount', 'Enter amount', true, 'numeric', 'BDT')}
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Tenor <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {tenorLimits.min} - {tenorLimits.max} months for {loanType || 'this'} loan
            </Text>
            <Controller
              control={control}
              name="tenor"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithSuffix,
                    {
                      backgroundColor: colors.background,
                      borderColor: errors.tenor ? colors.error : colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder={`${tenorLimits.min} - ${tenorLimits.max}`}
                  placeholderTextColor={colors.textSecondary}
                  value={value?.toString() || ''}
                  onChangeText={(text) => {
                    const numValue = parseInt(text) || tenorLimits.min;
                    onChange(Math.min(Math.max(numValue, tenorLimits.min), tenorLimits.max));
                  }}
                  keyboardType="numeric"
                />
              )}
            />
            <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
              months
            </Text>
            {errors.tenor && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.tenor.message}
              </Text>
            )}
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => {
              // Navigate to step 4 (Employment & Income)
              router.push('/apply-loan/4');
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
  helperText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
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
  inputWithSuffix: {
    paddingRight: 60,
  },
  inputSuffix: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 44,
  },
  picker: {
    height: 44,
  },
  customPurposeInput: {
    marginTop: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
  radioGroup: {
    gap: 12,
  },
  radioCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  radioCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  radioTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  radioDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginLeft: 32,
    lineHeight: 16,
  },
  emiCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  emiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emiTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginLeft: 8,
  },
  emiContent: {
    marginBottom: 12,
  },
  emiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emiLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
  },
  emiValue: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  emiPrimary: {
    fontSize: 18,
  },
  emiNote: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 15,
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