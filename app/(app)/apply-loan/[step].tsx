import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../../components/ui/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import step components
import ChooseProductStep from './steps/ChooseProductStep';
import LoanDetailsStep from './steps/LoanDetailsStep';
import EmploymentIncomeStep from './steps/EmploymentIncomeStep';
import UploadDocumentsStep from './steps/UploadDocumentsStep';
import DeclarationsConsentStep from './steps/DeclarationsConsentStep';

// Simple SubmittedStep component
function SubmittedStep() {
  const { colors } = useTheme();
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18, color: colors.textPrimary, marginBottom: 16 }}>
        Application Submitted Successfully!
      </Text>
      <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 }}>
        Your loan application has been submitted and is being processed.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: colors.primaryNavy2,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
        onPress={() => router.push('/dashboard')}
      >
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.textOnPrimary }}>
          Back to Dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const TOTAL_STEPS = 4;

const stepTitles = {
  '1': 'Choose Loan Product',
  '2': 'Loan Details', // Redirect to step 3
  '3': 'Loan Details',
  '4': 'Employment & Income',
  '6': 'Declarations & Consent',
  'submitted': 'Application Submitted',
};

export default function LoanApplicationStep() {
  const { colors } = useTheme();
  const router = useRouter();
  const { step } = useLocalSearchParams();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const currentStep = Array.isArray(step) ? step[0] : step;
  const stepNumber = parseInt(currentStep) || 0;

  // Map actual step numbers to display numbers
  const stepMapping = {
    '1': 1,
    '2': 2, // Will redirect to step 3
    '3': 2,
    '4': 3,
    '6': 4
  };

  useEffect(() => {
    loadDraftData();
  }, []); // Only load once on mount

  // Handle step 2 redirect
  useEffect(() => {
    if (currentStep === '2') {
      router.replace('/apply-loan/3');
    }
  }, [currentStep, router]);

  const loadDraftData = async () => {
    try {
      const draft = await AsyncStorage.getItem('loanDraft');
      if (draft) {
        const parsedData = JSON.parse(draft);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const saveDraftData = async (stepData: any) => {
    try {
      const updatedData = { ...formData, [currentStep]: stepData };
      await AsyncStorage.setItem('loanDraft', JSON.stringify(updatedData));
      setFormData(updatedData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleNext = async () => {
    if (!isValid) return;

    setIsLoading(true);
    
    try {
      // Navigate to next step
      const nextStepMap = {
        '1': '3',
        '3': '4',
        '4': '5',
        '5': '6',
        '6': 'review'
      };
      
      const nextStep = nextStepMap[currentStep];
      if (nextStep) {
        router.push(`/apply-loan/${nextStep}`);
      }
    } catch (error) {
      console.error('Error navigating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const prevStepMap = {
      '3': '1',
      '4': '3',
      '5': '4',
      '6': '5'
    };
    
    const prevStep = prevStepMap[currentStep];
    if (prevStep) {
      router.push(`/apply-loan/${prevStep}`);
    } else {
      router.back();
    }
  };

  const handleStepData = (data: any, valid: boolean) => {
    setIsValid(valid);
    if (valid) {
      saveDraftData(data);
    }
  };

  const renderStep = () => {
    const stepData = formData[currentStep] || {};
    
    switch (currentStep) {
      case '1':
        return (
          <ChooseProductStep 
            data={stepData}
            onDataChange={handleStepData}
          />
        );
      case '2':
        // Step 2 is skipped in the loan flow, redirect to step 3
        return null;
      case '3':
        return (
          <LoanDetailsStep 
            data={stepData}
            loanType={formData['1']?.loanType}
            onDataChange={handleStepData}
          />
        );
      case '4':
        return (
          <EmploymentIncomeStep 
            data={stepData}
            customerSegment={formData['1']?.customerSegment}
            onDataChange={handleStepData}
          />
        );
      case '5':
        return (
          <UploadDocumentsStep 
            data={stepData}
            loanType={formData['1']?.loanType}
            onDataChange={handleStepData}
          />
        );
      case '6':
        return (
          <DeclarationsConsentStep 
            data={stepData}
            onDataChange={handleStepData}
          />
        );
      default:
        return (
          <ChooseProductStep 
            data={stepData}
            onDataChange={handleStepData}
          />
        );
    }
  };

  const renderStepIndicator = () => {
    if (currentStep === 'submitted') return null;

    const totalSteps = TOTAL_STEPS;
    
    // Map actual step numbers to display numbers
    const stepMapping = {
      '1': 1,
      '3': 2,
      '4': 3,
      '5': 4,
      '6': 4
    };
    
    const current = stepMapping[currentStep] || 1;

    return (
      <View style={styles.stepIndicator}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === current;
          const isCompleted = stepNum < current;

          return (
            <View key={stepNum} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: isActive || isCompleted ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    {
                      color: isActive || isCompleted ? '#fff' : colors.textSecondary,
                    },
                  ]}
                >
                  {stepNum}
                </Text>
              </View>
              {stepNum < totalSteps && (
                <View
                  style={[
                    styles.stepLine,
                    {
                      backgroundColor: isCompleted ? colors.primary : colors.border,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderNavigation = () => {
    // Navigation removed - using inline buttons in each step component
    return null;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primaryNavy2, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Icon icon="ArrowLeft" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: '#ffffff' }]}>
            {stepTitles[currentStep] || 'Apply for Loan'}
          </Text>
          {(stepNumber > 0 && stepNumber <= TOTAL_STEPS) || currentStep === 'review' ? (
            <Text style={[styles.headerSubtitle, { color: '#ffffff80' }]}>
              Step {stepMapping[currentStep] || stepNumber} of {TOTAL_STEPS}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <View style={styles.content}>
        {renderStep()}
      </View>

      {/* Navigation */}
      <View style={[styles.navigationContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {renderNavigation()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
  },
  headerSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginTop: 2,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  navigationContainer: {
    borderTopWidth: 1,
    paddingBottom: 34, // Extra padding for safe area
  },
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
  },
  backButton: {
    borderWidth: 1,
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
  navButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    marginHorizontal: 8,
  },
});