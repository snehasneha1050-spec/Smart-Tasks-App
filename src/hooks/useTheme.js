import { useSelector } from 'react-redux';

export const useTheme = () => {
  const { darkMode } = useSelector(state => state.theme);

  const colors = {
    // Light theme
    light: {
      background: '#F3F4F6',
      surface: '#FFFFFF',
      primary: '#6200EA',
      secondary: '#03DAC6',
      text: '#333333',
      textSecondary: '#666666',
      border: '#E0E0E0',
      error: '#B00020',
      success: '#4CAF50',
      warning: '#FF9800',
      cardBackground: '#FFFFFF',
      inputBackground: '#F9F9F9',
      buttonPrimary: '#6200EA',
      buttonSecondary: '#FFFFFF',
    },
    // Dark theme
    dark: {
      background: '#121212',
      surface: '#1E1E1E',
      primary: '#BB86FC',
      secondary: '#03DAC6',
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      border: '#333333',
      error: '#CF6679',
      success: '#4CAF50',
      warning: '#FF9800',
      cardBackground: '#2D2D2D',
      inputBackground: '#3A3A3A',
      buttonPrimary: '#BB86FC',
      buttonSecondary: '#333333',
    },
  };

  return {
    colors: darkMode ? colors.dark : colors.light,
    isDark: darkMode,
  };
};