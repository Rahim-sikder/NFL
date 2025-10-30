import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform } from 'react-native';

interface MarqueeTextProps {
  text: string;
  speed?: number;
  backgroundColor?: string;
  textColor?: string;
  height?: number;
}

export default function MarqueeText({ 
  text, 
  speed = 50, 
  backgroundColor = '#0f5aa6', 
  textColor = '#ffffff',
  height = 40 
}: MarqueeTextProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const textWidth = text.length * 6; // Reduced multiplier for better calculation

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const startAnimation = () => {
      // Reset animation value
      animatedValue.setValue(screenWidth + 50); // Start slightly off-screen
      
      Animated.timing(animatedValue, {
        toValue: -textWidth - 50, // End slightly off-screen
        duration: (screenWidth + textWidth + 100) * speed,
        useNativeDriver: false, // Disable native driver for web compatibility
      }).start((finished) => {
        if (finished) {
          // Immediate restart without delay
          startAnimation();
        }
      });
    };

    // Start animation immediately
    startAnimation();
    
    // No cleanup needed as animation handles its own loop
    return () => {};
  }, [animatedValue, screenWidth, textWidth, speed]);

  return (
    <View style={[styles.container, { backgroundColor, height, minHeight: height }]}>
      <Animated.View
        style={[
          styles.textContainer,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
      >
        <Text style={[styles.text, { color: textColor }]} numberOfLines={1}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    width: '100%',
  },
  textContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: 'auto',
  },
  text: {
    fontSize: 16, // 1rem equivalent (16px)
    fontFamily: 'Poppins_400Regular',
    fontWeight: '400',
    ...(Platform.OS === 'web' && {
      whiteSpace: 'nowrap' as any,
    }),
  },
});