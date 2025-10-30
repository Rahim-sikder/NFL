import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';

export default function MarketingBar() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  
  const containerStyle = {
    ...styles.container,
    backgroundColor: '#0267b5',
    paddingBottom: insets.bottom,
  };
  
  return (
    <View style={containerStyle}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.signUpButton]} 
          onPress={() => router.push('/register')}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.signUpText]}>SIGN UP</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.logInButton]} 
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.logInText]}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpButton: {
    backgroundColor: '#3d81c4',
    borderWidth: 2,
    borderColor: '#3d81c4',
  },
  logInButton: {
    backgroundColor: '#f28a1b',
    borderWidth: 2,
    borderColor: '#f28a1b',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  signUpText: {
    color: '#FFFFFF',
  },
  logInText: {
    color: '#FFFFFF',
  },
});