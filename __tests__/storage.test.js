import fs from 'fs';
import path from 'path';
import { saveUserTasks, loadUserTasks } from '../src/utils/storage';

describe('storage API', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
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

  it('saves tasks through the backend API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    await saveUserTasks('alice', [{ id: '1', title: 'Task 1', completed: false }]);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/tasks/alice'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('loads tasks from the backend API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ tasks: [{ id: '2', title: 'Task 2', completed: true }] }),
    });

    const tasks = await loadUserTasks('alice');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/tasks/alice'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(tasks).toEqual([{ id: '2', title: 'Task 2', completed: true }]);
  });
});
