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

const API_BASE_URL = 'http://10.0.2.2:5000';

const requestJson = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = typeof response.json === 'function'
    ? await response.json()
    : await response.text().then((payload) => (payload ? JSON.parse(payload) : {}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

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

export const saveUserTasks = async (username, tasks) => {
  if (!username) return [];

  const result = await requestJson(`/api/tasks/${encodeURIComponent(username)}`, {
    method: 'PUT',
    body: JSON.stringify({ tasks }),
  });

  return result.tasks || tasks;
};

export const loadUserTasks = async (username) => {
  if (!username) return [];

  try {
    const result = await requestJson(`/api/tasks/${encodeURIComponent(username)}`, {
      method: 'GET',
    });

    return Array.isArray(result.tasks) ? result.tasks : [];
  } catch (error) {
    console.error('Error loading user tasks from MySQL backend:', error);
    return [];
  }
};

export const registerUser = async ({ username, email, password }) => {
  return requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
};

export const loginUserRequest = async ({ username, password }) => {
  return requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const validateUserSession = async ({ username, sessionToken }) => {
  if (!username || !sessionToken) return { success: false, message: 'Missing session data.' };

  return requestJson(`/api/auth/session/${encodeURIComponent(username)}/${encodeURIComponent(sessionToken)}`, {
    method: 'GET',
  });
};

export const logoutUserSession = async ({ username, sessionToken }) => {
  if (!username || !sessionToken) return { success: true };

  return requestJson(`/api/auth/session/${encodeURIComponent(username)}/${encodeURIComponent(sessionToken)}`, {
    method: 'DELETE',
  });
};

export const resetUserPassword = async ({ username, newPassword }) => {
  return requestJson('/api/auth/reset-password', {
    method: 'PUT',
    body: JSON.stringify({ username, newPassword }),
  });
};

export const saveUserPreferences = async (username, preferences = {}) => {
  if (!username) return {};

  const payload = {
    darkMode: Boolean(preferences.darkMode),
    language: preferences.language || 'English',
    notificationsEnabled: preferences.notificationsEnabled !== false,
  };

  const result = await requestJson(`/api/preferences/${encodeURIComponent(username)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return result.preferences || payload;
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
    const result = await requestJson(`/api/preferences/${encodeURIComponent(username)}`, {
      method: 'GET',
    });

    return {
      darkMode: Boolean(result?.preferences?.darkMode),
      language: result?.preferences?.language || 'English',
      notificationsEnabled: result?.preferences?.notificationsEnabled !== false,
    };
  } catch (error) {
    console.error('Error loading user preferences from MySQL backend:', error);
    return {
      darkMode: false,
      language: 'English',
      notificationsEnabled: true,
    };
  }
};

export const saveTasks = async (tasks) => {
  return saveUserTasks('default', tasks);
};

export const loadTasks = async () => {
  return loadUserTasks('default');
};

export const clearTasks = async () => {
  try {
    await requestJson('/api/tasks/default', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
};
