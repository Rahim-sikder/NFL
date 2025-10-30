import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

interface WindowDimensions {
  width: number;
  height: number;
}

export function useWindowDimensions(): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  return windowDimensions;
}

export function useResponsive() {
  const { width } = useWindowDimensions();
  
  // Constrain mobile viewport
  const constrainedWidth = Math.min(Math.max(width, 360), 420);
  const isSmall = constrainedWidth < 400;
  
  // New spacing values
  const contentPadding = 16;
  const gutterBetweenCards = 12;
  
  // FeatureCard responsive height (128-144)
  const cardMinHeight = isSmall ? 128 : 144;
  
  return {
    isSmall,
    constrainedWidth,
    cardMinHeight,
    contentPadding,
    gutterBetweenCards,
    // Legacy support
    gridGap: gutterBetweenCards,
  };
}