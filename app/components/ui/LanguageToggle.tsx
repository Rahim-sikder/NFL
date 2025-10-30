import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeProvider';

interface LanguageToggleProps {
  onLanguageChange?: (language: 'en' | 'bn') => void;
}

export default function LanguageToggle({ onLanguageChange }: LanguageToggleProps) {
  const { colors } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage === 'bn' || savedLanguage === 'en') {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language preference:', error);
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'bn' : 'en';
    setCurrentLanguage(newLanguage);
    
    try {
      await AsyncStorage.setItem('app_language', newLanguage);
      if (onLanguageChange) {
        onLanguageChange(newLanguage);
      }
    } catch (error) {
      console.log('Error saving language preference:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.languageButton,
          { 
            backgroundColor: currentLanguage === 'bn' ? colors.primaryNavy2 : 'rgba(0,0,0,0.1)',
          }
        ]}
        onPress={toggleLanguage}
      >
        <Text style={[
          styles.languageText,
          { 
            color: currentLanguage === 'bn' ? '#ffffff' : '#00000080',
            fontWeight: currentLanguage === 'bn' ? '600' : '400'
          }
        ]}>
          বাং
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.languageButton,
          { 
            backgroundColor: currentLanguage === 'en' ? colors.primaryNavy2 : 'rgba(0,0,0,0.1)',
          }
        ]}
        onPress={toggleLanguage}
      >
        <Text style={[
          styles.languageText,
          { 
            color: currentLanguage === 'en' ? '#ffffff' : '#00000080',
            fontWeight: currentLanguage === 'en' ? '600' : '400'
          }
        ]}>
          Eng
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },
});