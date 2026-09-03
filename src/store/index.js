import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
    theme: themeReducer,
  },
});