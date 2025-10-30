import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../../../theme/ThemeProvider';

interface StepConfig {
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

// Step 1: Product & Term
function ProductTermStep({ onNext }: { onNext: (data: any) => void }) {
  const { colors } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');

  const products = [
    { id: 'dps-regular', name: 'Regular DPS', rate: '8.5%' },
    { id: 'dps-premium', name: 'Premium DPS', rate: '9.0%' },
    { id: 'dps-special', name: 'Special DPS', rate: '9.5%' }
  ];

  const terms = [
    { id: '12', name: '12 Months' },
    { id: '24', name: '24 Months' },
    { id: '36', name: '36 Months' },
    { id: '60', name: '60 Months' }
  ];

  const handleNext = () => {
    if (!selectedProduct || !selectedTerm) {
      Alert.alert('Required', 'Please select both product and term');
      return;
    }
    onNext({ product: selectedProduct, term: selectedTerm });
  };

  return (
    <View style={styles.stepContent}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Select Product</Text>
      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          style={[
            styles.optionCard,
            {
              backgroundColor: colors.card,
              borderColor: selectedProduct === product.id ? colors.primary : colors.border
            }
          ]}
          onPress={() => setSelectedProduct(product.id)}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{product.name}</Text>
            <Text style={[styles.interestRate, { color: colors.primary }]}>Interest Rate: {product.rate}</Text>
          </View>
          <View style={[
            styles.radioButton,
            {
              borderColor: selectedProduct === product.id ? colors.primary : colors.border,
              backgroundColor: selectedProduct === product.id ? colors.primary : 'transparent'
            }
          ]}>
            {selectedProduct === product.id && (
              <Text style={[styles.radioCheck, { color: colors.white }]}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 24 }]}>Select Term</Text>
      {terms.map((term) => (
        <TouchableOpacity
          key={term.id}
          style={[
            styles.optionCard,
            {
              backgroundColor: colors.card,
              borderColor: selectedTerm === term.id ? colors.primary : colors.border
            }
          ]}
          onPress={() => setSelectedTerm(term.id)}
        >
          <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{term.name}</Text>
          <View style={[
            styles.radioButton,
            {
              borderColor: selectedTerm === term.id ? colors.primary : colors.border,
              backgroundColor: selectedTerm === term.id ? colors.primary : 'transparent'
            }
          ]}>
            {selectedTerm === term.id && (
              <Text style={[styles.radioCheck, { color: colors.white }]}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            backgroundColor: (selectedProduct && selectedTerm) ? colors.primary : colors.border,
            marginTop: 32
          }
        ]}
        onPress={handleNext}
        disabled={!selectedProduct || !selectedTerm}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// Step 2: Amount & Funding
function AmountFundingStep({ onNext }: { onNext: (data: any) => void }) {
  const { colors } = useTheme();
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [fundingSource, setFundingSource] = useState('');

  const fundingSources = [
    { id: 'bank-transfer', name: 'Bank Transfer' },
    { id: 'mobile-banking', name: 'Mobile Banking' },
    { id: 'cash-deposit', name: 'Cash Deposit' }
  ];

  const handleNext = () => {
    if (!monthlyAmount || !fundingSource) {
      Alert.alert('Required', 'Please enter amount and select funding source');
      return;
    }
    onNext({ monthlyAmount, fundingSource });
  };

  return (
    <View style={styles.stepContent}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Monthly Deposit Amount</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary
          }
        ]}
        value={monthlyAmount}
        onChangeText={setMonthlyAmount}
        placeholder="Enter monthly amount (BDT)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="numeric"
      />

      <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: 24 }]}>Funding Source</Text>
      {fundingSources.map((source) => (
        <TouchableOpacity
          key={source.id}
          style={[
            styles.optionCard,
            {
              backgroundColor: colors.card,
              borderColor: fundingSource === source.id ? colors.primary : colors.border
            }
          ]}
          onPress={() => setFundingSource(source.id)}
        >
          <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{source.name}</Text>
          <View style={[
            styles.radioButton,
            {
              borderColor: fundingSource === source.id ? colors.primary : colors.border,
              backgroundColor: fundingSource === source.id ? colors.primary : 'transparent'
            }
          ]}>
            {fundingSource === source.id && (
              <Text style={[styles.radioCheck, { color: colors.white }]}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            backgroundColor: (monthlyAmount && fundingSource) ? colors.primary : colors.border,
            marginTop: 32
          }
        ]}
        onPress={handleNext}
        disabled={!monthlyAmount || !fundingSource}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// Step 3: Personal & Contact (prefilled from e-KYC)
function PersonalContactStep({ onNext }: { onNext: (data: any) => void }) {
  const { colors } = useTheme();
  const form = useForm({
    defaultValues: {
      fullName: 'John Doe', // Would be prefilled from e-KYC
      fatherName: 'Father Name',
      motherName: 'Mother Name',
      dob: '1990-01-01',
      phone: '+8801712345678',
      email: 'john@example.com'
    }
  });

  const handleNext = () => {
    const data = form.getValues();
    onNext(data);
  };

  return (
    <View style={styles.stepContent}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Personal Information</Text>
      <Text style={[styles.helperText, { color: colors.textSecondary }]}>Information prefilled from e-KYC verification</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Full Name</Text>
        <Controller
          control={form.control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary
                }
              ]}
              value={value}
              onChangeText={onChange}
              placeholder="Full Name"
              placeholderTextColor={colors.textSecondary}
            />
          )}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Father's Name</Text>
        <Controller
          control={form.control}
          name="fatherName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary
                }
              ]}
              value={value}
              onChangeText={onChange}
              placeholder="Father's Name"
              placeholderTextColor={colors.textSecondary}
            />
          )}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>Mother's Name</Text>
        <Controller
          control={form.control}
          name="motherName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.textPrimary
                }
              ]}
              value={value}
              onChangeText={onChange}
              placeholder="Mother's Name"
              placeholderTextColor={colors.textSecondary}
            />
          )}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: colors.primary, marginTop: 32 }
        ]}
        onPress={handleNext}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// Placeholder steps for remaining steps
function PlaceholderStep({ stepNumber, title, onNext }: { stepNumber: number; title: string; onNext: (data: any) => void }) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.stepContent}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.helperText, { color: colors.textSecondary }]}>This step is under development.</Text>
      
      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: colors.primary, marginTop: 32 }
        ]}
        onPress={() => onNext({})}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// Final step - Review & Submit
function ReviewSubmitStep({ onNext }: { onNext: (data: any) => void }) {
  const { colors } = useTheme();
  const router = useRouter();
  
  const handleSubmit = () => {
    // Simulate form submission
    router.replace('/register/submitted');
  };
  
  return (
    <View style={styles.stepContent}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Review & Submit</Text>
      <Text style={[styles.helperText, { color: colors.textSecondary }]}>Please review your information before submitting your DPS application.</Text>
      
      <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.reviewTitle, { color: colors.textPrimary }]}>Application Summary</Text>
        <Text style={[styles.reviewItem, { color: colors.textSecondary }]}>• Product: Regular DPS</Text>
        <Text style={[styles.reviewItem, { color: colors.textSecondary }]}>• Term: 24 Months</Text>
        <Text style={[styles.reviewItem, { color: colors.textSecondary }]}>• Monthly Amount: BDT 5,000</Text>
        <Text style={[styles.reviewItem, { color: colors.textSecondary }]}>• Funding: Bank Transfer</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: colors.primary, marginTop: 32 }
        ]}
        onPress={handleSubmit}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Submit Application</Text>
      </TouchableOpacity>
    </View>
  );
}

const stepConfigs: Record<string, StepConfig> = {
  '1': {
    title: 'Product & Term',
    description: 'Select your DPS product and term',
    component: ProductTermStep
  },
  '2': {
    title: 'Amount & Funding',
    description: 'Set monthly amount and funding source',
    component: AmountFundingStep
  },
  '3': {
    title: 'Personal & Contact',
    description: 'Verify your personal information',
    component: PersonalContactStep
  },
  '4': {
    title: 'Address Details',
    description: 'Confirm address information',
    component: (props: any) => <PlaceholderStep stepNumber={4} title="Address Details" {...props} />
  },
  '5': {
    title: 'Nominee/Guardian',
    description: 'Add nominee and guardian details',
    component: (props: any) => <PlaceholderStep stepNumber={5} title="Nominee/Guardian" {...props} />
  },
  '6': {
    title: 'Document Upload',
    description: 'Upload required documents',
    component: (props: any) => <PlaceholderStep stepNumber={6} title="Document Upload" {...props} />
  },
  '7': {
    title: 'Declarations & FATCA/PEP',
    description: 'Complete declarations and compliance',
    component: (props: any) => <PlaceholderStep stepNumber={7} title="Declarations & FATCA/PEP" {...props} />
  },
  '8': {
    title: 'Review & Submit',
    description: 'Review and submit your application',
    component: ReviewSubmitStep
  }
};

export default function DPSStep() {
  const { colors } = useTheme();
  const router = useRouter();
  const { step } = useLocalSearchParams<{ step: string }>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const currentStep = step || '1';
  const stepConfig = stepConfigs[currentStep];
  const stepNumber = parseInt(currentStep);
  const totalSteps = Object.keys(stepConfigs).length;
  
  if (!stepConfig) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Invalid step</Text>
      </View>
    );
  }
  
  const handleNext = (stepData: any) => {
    const updatedFormData = { ...formData, [currentStep]: stepData };
    setFormData(updatedFormData);
    
    if (stepNumber < totalSteps) {
      router.push(`/open-deposit/dps/${stepNumber + 1}`);
    }
  };
  
  const handleBack = () => {
    if (stepNumber > 1) {
      router.push(`/open-deposit/dps/${stepNumber - 1}`);
    } else {
      router.back();
    }
  };
  
  const StepComponent = stepConfig.component;
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.stepIndicator}>
          <Text style={[styles.stepTitle, { color: colors.primaryNavy2 }]}>{stepConfig.title}</Text>
          <Text style={[styles.stepCounter, { color: colors.textSecondary }]}>{stepNumber}/{totalSteps}</Text>
        </View>
        <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>{stepConfig.description}</Text>
      </View>
      
      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.primary,
              width: `${(stepNumber / totalSteps) * 100}%`
            }
          ]} 
        />
      </View>
      
      {/* Step Content */}
      <View style={styles.content}>
        <StepComponent onNext={handleNext} formData={formData} />
      </View>
      
      {/* Back Button */}
      {stepNumber > 1 && stepNumber < totalSteps && (
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.border }]}
          onPress={handleBack}
        >
          <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>← Back</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  stepCounter: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  stepDescription: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    height: 4,
    marginHorizontal: 16,
    borderRadius: 2,
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  stepContent: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  helperText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 16,
  },
  optionCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 4,
  },
  interestRate: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  backButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  successSubtitle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    marginBottom: 24,
  },
  trackingCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  trackingLabel: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  trackingId: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
  },
  reviewCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  reviewTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  reviewItem: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 6,
  },
  errorText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});