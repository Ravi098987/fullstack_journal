import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'cyan';
  setTheme: (theme: 'light' | 'dark' | 'cyan') => Promise<void>;
  themeClasses: {
    bg: string;
    cardBg: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    button: string;
    input: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateTheme } = useAuth();
  const theme = user?.theme || 'light';

  const getThemeClasses = (currentTheme: string) => {
    switch (currentTheme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          cardBg: 'bg-gray-800/80 backdrop-blur-lg',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          border: 'border-gray-700',
          accent: 'text-purple-400',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
          input: 'bg-gray-700 text-white border-gray-600 focus:border-purple-500',
        };
      case 'cyan':
        return {
          bg: 'bg-teal-900',
          cardBg: 'bg-teal-800/80 backdrop-blur-lg',
          text: 'text-white',
          textSecondary: 'text-teal-100',
          border: 'border-teal-600',
          accent: 'text-cyan-300',
          button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
          input: 'bg-teal-700 text-white border-teal-600 focus:border-cyan-400',
        };
      default: // light
        return {
          bg: 'bg-blue-50',
          cardBg: 'bg-white/80 backdrop-blur-lg',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          border: 'border-gray-200',
          accent: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          input: 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
        };
    }
  };

  const setTheme = async (newTheme: 'light' | 'dark' | 'cyan') => {
    await updateTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      themeClasses: getThemeClasses(theme),
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};