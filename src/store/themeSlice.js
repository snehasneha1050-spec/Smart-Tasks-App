import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false,
  language: 'English',
  notificationsEnabled: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setNotificationsEnabled: (state, action) => {
      state.notificationsEnabled = !!action.payload;
    },
    setPreferences: (state, action) => {
      const { darkMode, language, notificationsEnabled } = action.payload || {};
      if (typeof darkMode === 'boolean') state.darkMode = darkMode;
      if (language) state.language = language;
      if (typeof notificationsEnabled === 'boolean') state.notificationsEnabled = notificationsEnabled;
    },
  },
});

export const { toggleTheme, setLanguage, setNotificationsEnabled, setPreferences } = themeSlice.actions;
export default themeSlice.reducer;