import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
const lightColors = {
  primary: '#0F3460',
  primaryLight: '#E6EBF4',
  accent: '#F7B633',
  accentLight: '#FEF5E1',
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  shadow: '#000000',
  inputBackground: '#F3F4F6',
  white: '#FFFFFF',
};

const darkColors = {
  primary: '#4676C4',
  primaryLight: '#1E293B',
  accent: '#F7B633',
  accentLight: '#382E1E',
  success: '#4CAF50',
  successLight: '#1B2E1C',
  warning: '#FF9800',
  warningLight: '#332917',
  error: '#F44336',
  errorLight: '#341B1A',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  background: '#111827',
  card: '#1F2937',
  border: '#374151',
  borderLight: '#272E3F',
  shadow: '#000000',
  inputBackground: '#374151',
  white: '#FFFFFF',
};

type ThemeColors = typeof lightColors;

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(colorScheme === 'dark' ? 'dark' : 'light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Select theme colors based on current theme
  const colors = theme === 'light' ? lightColors : darkColors;
  
  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}