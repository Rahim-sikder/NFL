import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingScreen from './components/onboarding/OnboardingScreen';

export default function OnboardingPage() {
  const router = useRouter();

  const handleOnboardingComplete = () => {
    router.replace('/(public)');
  };

  return (
    <OnboardingScreen onComplete={handleOnboardingComplete} />
  );
}