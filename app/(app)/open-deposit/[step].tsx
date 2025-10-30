import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '../../components/ui/Icon';

// Import step components
import DepositTypeStep from '../../components/deposit/DepositTypeStep';
import DepositDetailsStep from '../../components/deposit/DepositDetailsStep';
import NomineeDetailsStep from '../../components/deposit/NomineeDetailsStep';
import PaymentStep from '../../components/deposit/PaymentStep';
import BankDetailsStep from '../../components/deposit/BankDetailsStep';

// Import validation schemas
import {
  depositTypeSchema,
  depositDetailsSchema,
  nomineeDetailsSchema,
  paymentTermsSchema,
  bankDetailsSchema,
  fullApplicationSchema
} from '../../../lib/depositSchemas';

const DRAFT_KEY = 'odraft';

const stepConfig = {
  0: {
    title: 'Deposit Type',
    component: DepositTypeStep,
    schema: depositTypeSchema,
    nextStep: 1
  },
  1: {
    title: 'Deposit Details',
    component: DepositDetailsStep,
    schema: depositDetailsSchema,
    nextStep: 2
  },
  2: {
    title: 'Nominee Details',
    component: NomineeDetailsStep,
    schema: nomineeDetailsSchema,
    nextStep: 3
  },
  3: {
    title: 'Add Nominee',
    component: BankDetailsStep,
    schema: bankDetailsSchema,
    nextStep: 4
  },
  4: {
    title: 'Payment',
    component: PaymentStep,
    schema: paymentTermsSchema,
    nextStep: 'review'
  },

};

const getStepNumber = (step: string): string => {
  if (step === 'review') return 'Review';
  return `${parseInt(step) + 1}/5`;
};

const getNextStep = (currentStep: string): string => {
  const config = stepConfig[currentStep as keyof typeof stepConfig];
  if (config?.nextStep === 'review') {
    return 'review';
  }
  return config?.nextStep?.toString() || '';
};

const getPrevStep = (currentStep: string): string => {
  const steps = ['0', '1', '2', '3', '4', 'review'];
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex > 0 ? steps[currentIndex - 1] : '0';
};

export default function DepositWizardStep() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const currentStep = step || '0';
  const config = stepConfig[currentStep as keyof typeof stepConfig];

  const methods = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: {
      ...formData[currentStep] || {},
      // Include deposit type data for all steps after step 0
      ...(currentStep !== '0' && formData['0'] ? formData['0'] : {}),
    },
    mode: 'onSubmit'
  });

  const { handleSubmit, reset } = methods;

  // Load draft data on mount
  useEffect(() => {
    loadDraftData();
  }, []);

  // Update form when step changes
  useEffect(() => {
    const stepData = formData[currentStep] || {};
    const depositTypeData = currentStep !== '0' && formData['0'] ? formData['0'] : {};
    
    reset({
      ...stepData,
      ...depositTypeData,
    });
  }, [currentStep, formData, reset]);

  const loadDraftData = async () => {
    try {
      const draft = await AsyncStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        setHasDraft(true);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const saveDraft = async (stepData: any) => {
    try {
      const updatedData = { ...formData, [currentStep]: stepData };
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(updatedData));
      setFormData(updatedData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
      setFormData({});
      setHasDraft(false);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  const onNext = async (data: any) => {
    setIsLoading(true);
    await saveDraft(data);
    
    const nextStep = getNextStep(currentStep);
    if (nextStep === 'review') {
      router.push('/open-deposit/review');
    } else {
      router.push(`/open-deposit/${nextStep}`);
    }
    setIsLoading(false);
  };

  const onPrevious = () => {
    const prevStep = getPrevStep(currentStep);
    router.push(`/open-deposit/${prevStep}`);
  };

  const resumeDraft = () => {
    setHasDraft(false);
  };

  const startFresh = () => {
    clearDraft();
  };

  if (!config) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid step</Text>
      </View>
    );
  }

  const StepComponent = config.component;

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
            <Icon icon="ArrowLeft" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>{stepConfig[currentStep]?.title}</Text>
          <Text style={styles.stepIndicator}>{getStepNumber(currentStep)}</Text>
        </View>
      </View>

      {/* Draft Resume Banner */}
      {hasDraft && currentStep === '0' && (
        <View style={styles.draftBanner}>
          <Text style={styles.draftText}>You have a saved draft</Text>
          <View style={styles.draftButtons}>
            <TouchableOpacity style={styles.draftButton} onPress={resumeDraft}>
              <Text style={styles.draftButtonText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.draftButton, styles.draftButtonSecondary]} onPress={startFresh}>
              <Text style={[styles.draftButtonText, styles.draftButtonTextSecondary]}>Start Fresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FormProvider {...methods}>
          <StepComponent 
            formData={formData}
            currentStepData={formData[currentStep] || {}}
            isReviewMode={currentStep === 'review'}
            onNext={onNext}
          />
        </FormProvider>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {currentStep !== '1' && (
          <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={onPrevious}>
            <Text style={styles.prevButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton, isLoading && styles.disabledButton]} 
          onPress={handleSubmit(onNext)}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Loading...' : currentStep === '4' ? 'Review & Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0F5AA6',
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#0A2E5C',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stepInfo: {
    flex: 1,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    gap: 8,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  draftBanner: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffeaa7',
  },
  draftText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
  },
  draftButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  draftButton: {
    backgroundColor: '#0A2E5C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  draftButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0A2E5C',
  },
  draftButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  draftButtonTextSecondary: {
    color: '#0A2E5C',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for navigation buttons
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  prevButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0A2E5C',
  },
  nextButton: {
    backgroundColor: '#0A2E5C',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  prevButtonText: {
    color: '#0A2E5C',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});