import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider';
import Icon from '../ui/Icon';

export default function HeaderBar() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== '/';

  const containerStyle = {
    ...styles.container,
    paddingTop: insets.top + 16,
  };

  return (
    <View
      style={[containerStyle, { backgroundColor: '#0267b5' }]}
    >
      <View style={styles.content}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon icon="ArrowLeft" size={22} color={colors.textOnPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.centerContent}>
          <Image
            source={require('../../../assets/nfl.png')}
            style={styles.logo}
            contentFit="contain"
            tintColor="#ffffff"
          />
        </View>
        {showBackButton && <View style={styles.spacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flex: 1,
  },
  spacer: {
    width: 40,
  },
  logo: {
    width: 180,
    height: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
    opacity: 0.9,
  },
});