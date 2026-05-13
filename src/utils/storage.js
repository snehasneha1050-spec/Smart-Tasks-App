import AsyncStorage from '@react-native-async-storage/async-storage';
import { dummyTasks } from '../data/dummyTasks';

const TASKS_KEY = '@smarttasksapp_tasks';

export const saveUserTasks = async (username, tasks) => {
  if (!username) return;
  try {
    await AsyncStorage.setItem(`@smarttasksapp_tasks_${username}`, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving user tasks:', error);
  }
};

export const loadUserTasks = async (username) => {
  if (!username) return [];
  try {
    const tasks = await AsyncStorage.getItem(`@smarttasksapp_tasks_${username}`);
    if (tasks !== null) return JSON.parse(tasks);
    await saveUserTasks(username, dummyTasks);
    return dummyTasks;
  } catch (error) {
    console.error('Error loading user tasks:', error);
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : null;
  } catch (error) {
    console.error('Error loading tasks:', error);
    return null;
  }
};

export const clearTasks = async () => {
  try {
    await AsyncStorage.removeItem(TASKS_KEY);
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
};
