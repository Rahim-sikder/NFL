import React from 'react';
import { Slot } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import MobileViewport from './components/MobileViewport';
import { ThemeProvider } from './theme/ThemeProvider';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function ThemedLayout() {
  return (
    <MobileViewport>
      <Slot />
    </MobileViewport>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedLayout />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}