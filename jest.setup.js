import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-encrypted-storage', () => ({
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('./src/utils/storage', () => {
  const actual = jest.requireActual('./src/utils/storage');

  return {
    ...actual,
    getSavedSession: jest.fn(() => Promise.resolve(null)),
    clearSavedSession: jest.fn(() => Promise.resolve()),
    saveSession: jest.fn(() => Promise.resolve()),
    loadUserPreferences: jest.fn(() => Promise.resolve({
      darkMode: false,
      language: 'English',
      notificationsEnabled: true,
    })),
    validateUserSession: jest.fn(() => Promise.resolve({ success: true })),
    logoutUserSession: jest.fn(() => Promise.resolve({ success: true })),
  };
});

global.window = {
  dispatchEvent: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

global.navigator = {
  userAgent: 'node.js',
};

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    onForegroundEvent: jest.fn(() => () => {}),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
  },
  EventType: {
    PRESS: 'press',
  },
}));
