import React from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface MobileViewportProps {
  children: React.ReactNode;
}

export default function MobileViewport({ children }: MobileViewportProps) {
  const { colors } = useTheme();
  
  const wrapperStyle = {
    ...styles.wrapper,
    // backgroundColor: '#f0f0f0',
  };

  const phoneFrameStyle = Platform.select({
    web: {
      ...styles.phoneFrame,
      minHeight: '100vh',
    },
    default: styles.phoneFrame,
  });

  const phoneScreenStyle = {
    ...styles.phoneScreen,
    backgroundColor: colors.surface,
  };

  return (
    <View style={wrapperStyle}>
      <View style={phoneFrameStyle as any}>
        <View style={phoneScreenStyle}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 420,
    minWidth: 360,
    flex: 1,
    // backgroundColor: '#2c2c2c',
    // borderRadius: 35,
    padding: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 20,
    // elevation: 20,
  },
  phoneScreen: {
    flex: 1,
    // borderRadius: 27,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: '#fc0a0aff',
    
  },
});