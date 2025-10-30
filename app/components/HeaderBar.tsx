import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

export default function HeaderBar() {
  const { colors, fontFamily } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryNavy} />
      <LinearGradient
        colors={[colors.primaryNavy, colors.primaryNavy2]}
        style={[styles.container, { paddingTop: insets.top + 16 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textOnPrimary, fontFamily: fontFamily.heading }]}>
          NFL Mobile Banking
        </Text>
        <Text style={[styles.subtitle, { color: colors.textOnPrimary, fontFamily: fontFamily.body }]}>
          Welcome back!
        </Text>
      </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    minHeight: 96,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
});