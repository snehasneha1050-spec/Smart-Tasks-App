import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';
import themeReducer from './themeSlice';
import { saveTasks } from '../utils/storage';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    theme: themeReducer,
  },
});

// Save tasks to AsyncStorage whenever they change
store.subscribe(() => {
  const state = store.getState();
  saveTasks(state.tasks.tasks);
});