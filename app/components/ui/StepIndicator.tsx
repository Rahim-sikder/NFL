import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function StepIndicator({ currentStep, totalSteps, title }: StepIndicatorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.pageTitle, { color: colors.primaryNavy2 }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  pageTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    flex: 1,
  },
  stepText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    opacity: 0.7,
  },
});

export { StepIndicator };