import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Using TextInput for date input instead of DateTimePicker to avoid dependency issues
import { useTheme } from '../../../theme/ThemeProvider';
import Icon from '../../../components/ui/Icon';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name too long'),
  fatherMotherSpouse: z.string().optional(),
  nidPassport: z.string().min(10, 'NID/Passport number is required'),
  dateOfBirth: z.string({
    required_error: 'Date of birth is required',
  }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter date in YYYY-MM-DD format'),
  mobileNumber: z.string().regex(/^(\+?88)?0?\d{11,13}$/, 'Invalid Bangladesh mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  presentAddress: z.string().min(10, 'Present address is required'),
  permanentAddress: z.string().min(10, 'Permanent address is required'),
}).refine((data) => {
  const date = new Date(data.dateOfBirth);
  const age = new Date().getFullYear() - date.getFullYear();
  return age >= 18;
}, {
  message: 'Must be at least 18 years old',
  path: ['dateOfBirth'],
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<FormData>;
  onDataChange: (data: FormData, isValid: boolean) => void;
}

export default function ApplicantInfoStep({ data, onDataChange }: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const [sameAsPresent, setSameAsPresent] = useState(false);

  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fullName: data.fullName || '',
      fatherMotherSpouse: data.fatherMotherSpouse || '',
      nidPassport: data.nidPassport || '',
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      mobileNumber: data.mobileNumber || '',
      email: data.email || '',
      presentAddress: data.presentAddress || '',
      permanentAddress: data.permanentAddress || '',
    },
  });

  const watchedValues = watch();
  const presentAddress = watch('presentAddress');

  useEffect(() => {
    if (isValid) {
      onDataChange(watchedValues, true);
    } else {
      onDataChange(watchedValues, false);
    }
  }, [watchedValues, isValid, onDataChange]);

  useEffect(() => {
    if (sameAsPresent && presentAddress) {
      setValue('permanentAddress', presentAddress);
      trigger('permanentAddress');
    }
  }, [sameAsPresent, presentAddress, setValue, trigger]);

  const calculateAge = (dateString: string) => {
    if (!dateString) return 0;
    const today = new Date();
    const birth = new Date(dateString);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const renderInput = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    required = false,
    keyboardType: any = 'default',
    multiline = false
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
              multiline && styles.textArea,
              {
                backgroundColor: colors.background,
                borderColor: errors[name] ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={value?.toString() || ''}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
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
          Please provide your personal information. Fields marked with * are required.
        </Text>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Personal Information
          </Text>

          {renderInput('fullName', 'Full Name', 'Enter your full name', true)}
          {renderInput('fatherMotherSpouse', "Father's/Mother's/Spouse Name", 'Enter name (optional)')}
          {renderInput('nidPassport', 'NID/Passport Number', 'Enter NID or Passport number', true)}

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Date of Birth <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: errors.dateOfBirth ? colors.error : colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="YYYY-MM-DD (e.g., 1990-01-15)"
                  placeholderTextColor={colors.textSecondary}
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.dateOfBirth && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.dateOfBirth.message}
              </Text>
            )}

          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contact Information
          </Text>

          {renderInput('mobileNumber', 'Mobile Number', '+880 1XXXXXXXXX', true, 'phone-pad')}
          {renderInput('email', 'Email Address', 'your.email@example.com (optional)', false, 'email-address')}
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Address Information
          </Text>

          {renderInput('presentAddress', 'Present Address', 'Enter your current address', true, 'default', true)}

          {/* Same as Present Address Toggle */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setSameAsPresent(!sameAsPresent)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: sameAsPresent ? colors.primary : 'transparent',
                  borderColor: colors.border,
                },
              ]}
            >
              {sameAsPresent && (
                <Icon icon="Check" size={16} color="#fff" />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>
              Permanent address is same as present address
            </Text>
          </TouchableOpacity>

          {renderInput('permanentAddress', 'Permanent Address', 'Enter your permanent address', true, 'default', true)}
        </View>

        {/* Age Warning */}
        {watchedValues.dateOfBirth && calculateAge(watchedValues.dateOfBirth) < 18 && (
          <View
            style={[
              styles.warningCard,
              {
                backgroundColor: colors.error + '10',
                borderColor: colors.error + '30',
              },
            ]}
          >
            <Icon icon="AlertTriangle" size={16} color={colors.error} />
            <Text style={[styles.warningText, { color: colors.error }]}>
              You must be at least 18 years old to apply for a loan.
            </Text>
          </View>
        )}

        {/* Next Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={() => {
              // Save current form data and navigate to next step
              const formData = getValues();
              onDataChange(formData, isValid);
              router.push('/apply-loan/3');
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    flex: 1,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
  },
  warningText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
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