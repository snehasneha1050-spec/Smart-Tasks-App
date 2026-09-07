let EncryptedStorage = {
  setItem: async () => {},
  getItem: async () => null,
  removeItem: async () => {},
};

try {
  const encryptedStorageModule = require('react-native-encrypted-storage');
  EncryptedStorage = encryptedStorageModule.default || encryptedStorageModule;
} catch (error) {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('Encrypted storage not available in this environment; session persistence will be skipped.', error.message);
  }
}

import api from '../services/api';

export const saveSession = async ({ username, sessionToken }) => {
  if (!username || !sessionToken) return;

  await EncryptedStorage.setItem(
    'smart_tasks_session',
    JSON.stringify({ username, sessionToken })
  );
};

export const getSavedSession = async () => {
  try {
    const value = await EncryptedStorage.getItem('smart_tasks_session');
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
};

export const clearSavedSession = async () => {
  try {
    await EncryptedStorage.removeItem('smart_tasks_session');
  } catch (error) {
    console.error('Failed to clear session storage:', error);
  }
};

export const saveUserPreferences = async (username, preferences = {}) => {
  if (!username) return {};

  const payload = {
    darkMode: Boolean(preferences.darkMode),
    language: preferences.language || 'English',
    notificationsEnabled: preferences.notificationsEnabled !== false,
  };

  const result = await api.put('/user/preferences', payload);
  return result.data.preferences || payload;
};

export const loadUserPreferences = async (username) => {
  if (!username) {
    return {
      darkMode: false,
      language: 'English',
      notificationsEnabled: true,
    };
  }

  try {
    const result = await api.get('/user/preferences');

    return {
      darkMode: Boolean(result.data?.preferences?.darkMode),
      language: result.data?.preferences?.language || 'English',
      notificationsEnabled: result.data?.preferences?.notificationsEnabled !== false,
    };
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return {
      darkMode: false,
      language: 'English',
      notificationsEnabled: true,
    };
  }
};
