import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useResponsive } from '../../hooks/useResponsive';
import { Icon } from './Icon';

type TintVariant = 'orange' | 'blue' | 'green';

interface FeatureCardProps {
  title: string;
  iconName: string;
  tint?: TintVariant;
  onPress?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, iconName, tint, onPress }) => {
  const { colors, radius, space, shadow, fontFamily } = useTheme();
  const { cardMinHeight } = useResponsive();

  const getTintStyles = (variant?: TintVariant) => {
    switch (variant) {
      case 'orange':
        return {
          backgroundColor: '#FFF3E6',
          iconColor: colors.accentOrange,
        };
      case 'blue':
        return {
          backgroundColor: '#E7F0FB',
          iconColor: colors.primaryNavy2,
        };
      case 'green':
        return {
          backgroundColor: '#EAF5EC',
          iconColor: colors.successGreen,
        };
      default:
        return {
          backgroundColor: '#F5F5F5',
          iconColor: colors.textPrimary,
        };
    }
  };

  const tintStyles = getTintStyles(tint);

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: 8, // Increased from 4 to 8 for better touch targets
          // Removed minHeight: cardMinHeight to use our custom minHeight
          ...shadow,
        },
      ]}
      onPress={onPress}
      hitSlop={8}
      android_ripple={{
        color: 'rgba(255,255,255,0.15)',
        borderless: false,
      }}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: tintStyles.backgroundColor,
          },
        ]}
      >
        <Icon
          icon={iconName}
          size="sm"
          color={tintStyles.iconColor}
        />
      </View>
      <Text
        style={[
          styles.title,
          {
            fontFamily: fontFamily.heading,
            color: colors.textPrimary,
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    minHeight: 12, // Set to exactly 12px as requested
    minWidth: 44, // Ensure minimum touch target
    gap: 4, // Increased from 2 to 4 for better spacing
  },
  iconWrapper: {
    width: 28, // Increased from 20 to 28 for better visibility
    height: 28, // Increased from 20 to 28 for better visibility
    borderRadius: 14, // Adjusted to match new size
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 11, // Increased from 10 to 11 for better readability
    textAlign: 'center',
  },
});

export default FeatureCard;