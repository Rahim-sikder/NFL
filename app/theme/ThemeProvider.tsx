import React, { createContext, useContext, ReactNode } from 'react';
import colors from './colors';

interface Theme {
  colors: typeof colors;
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  space: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  shadow: {
    md: {
      elevation: number;
      shadowOpacity: number;
    };
  };
  fontFamily: {
    heading: string;
    body: string;
  };
}

const theme: Theme = {
  colors,
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
  },
  space: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
  },
  shadow: {
    md: {
      elevation: 4,
      shadowOpacity: 0.15,
    },
  },
  fontFamily: {
    heading: 'Poppins_600SemiBold',
    body: 'Poppins_400Regular',
  },
};

const ThemeContext = createContext<Theme | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;