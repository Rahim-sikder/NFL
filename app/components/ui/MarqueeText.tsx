import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface MarqueeTextProps {
  text: string;
  speed?: number;
  style?: any;
}

export default function MarqueeText({ 
  text, 
  speed = 50,
  style 
}: MarqueeTextProps) {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const textWidth = useRef(0);

  useEffect(() => {
    const startAnimation = () => {
      animatedValue.setValue(screenWidth);
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: -textWidth.current,
          duration: (screenWidth + textWidth.current) * speed,
          useNativeDriver: true,
        })
      ).start();
    };

    // Start animation after a short delay to ensure text width is measured
    const timer = setTimeout(startAnimation, 100);
    return () => clearTimeout(timer);
  }, [text, speed]);

  const onTextLayout = (event: any) => {
    textWidth.current = event.nativeEvent.layout.width;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryNavy2 }]}>
      <Animated.View
        style={[
          styles.textContainer,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: '#ffffff' },
            style
          ]}
          onLayout={onTextLayout}
          numberOfLines={1}
        >
          {text}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    whiteSpace: 'nowrap',
  },
});