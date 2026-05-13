import { createSlice } from '@reduxjs/toolkit';
import { logoutUser } from './userSlice';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [], // Start with an empty list. Tasks will be loaded per user.
  },
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    toggleComplete: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    loadTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser, (state) => {
      state.tasks = []; // Reset tasks to an empty array on user logout
    });
  },
});

export const { addTask, deleteTask, updateTask, toggleComplete, loadTasks } = taskSlice.actions;
export default taskSlice.reducer;