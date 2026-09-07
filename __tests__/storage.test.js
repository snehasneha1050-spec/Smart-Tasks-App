import fs from 'fs';
import path from 'path';
import api from '../src/services/api';
import { saveUserPreferences } from '../src/utils/storage';

jest.mock('../src/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe('storage API', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.put.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not use AsyncStorage for app persistence', () => {
    const srcRoot = path.join(__dirname, '../src');
    const files = [];

    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && /\.(js|ts|tsx)$/.test(entry.name)) {
          files.push(fullPath);
        }
      }
    };

    walk(srcRoot);

    const content = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');

    expect(content).not.toMatch(/@react-native-async-storage\/async-storage|loggedInUser/);
  });

  it('saves preferences through the authenticated backend API', async () => {
    api.put.mockResolvedValue({
      data: { success: true, preferences: { darkMode: true, language: 'Hindi', notificationsEnabled: false } },
    });

    const preferences = await saveUserPreferences('alice', {
      darkMode: true,
      language: 'Hindi',
      notificationsEnabled: false,
    });

    expect(api.put).toHaveBeenCalledWith('/user/preferences', {
      darkMode: true,
      language: 'Hindi',
      notificationsEnabled: false,
    });
    expect(preferences.language).toBe('Hindi');
  });

  it('does not contain legacy username-based API endpoints', () => {
    const storageSource = fs.readFileSync(path.join(__dirname, '../src/utils/storage.js'), 'utf8');

    expect(storageSource).not.toMatch(/\/api\/(tasks|preferences|auth\/session)/);
    expect(storageSource).toContain("api.get('/user/preferences')");
  });
});
