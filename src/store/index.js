import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';
import themeReducer from './themeSlice';
import { saveUserTasks } from '../utils/storage';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    theme: themeReducer,
  },
});

// Save tasks to AsyncStorage for the logged-in user whenever tasks change
store.subscribe(() => {
  const state = store.getState();
  if (state.user.isLoggedIn && state.user.username) {
    saveUserTasks(state.user.username, state.tasks.tasks);
  }
});