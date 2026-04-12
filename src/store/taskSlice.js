import { createSlice } from '@reduxjs/toolkit';
import { dummyTasks } from '../data/dummyTasks';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: dummyTasks,
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
  },
});

export const { addTask, deleteTask, updateTask, toggleComplete } = taskSlice.actions;
export default taskSlice.reducer;