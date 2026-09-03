import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTasks,
  createTask,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  toggleTask,
} from '../services/taskService';
import { logoutUser } from './userSlice';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const response = await getTasks();
    return Array.isArray(response?.tasks) ? response.tasks : [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch tasks.');
  }
});

export const addTask = createAsyncThunk('tasks/addTask', async (task, { rejectWithValue }) => {
  try {
    const response = await createTask(task);
    return response?.task || task;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add task.');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task, { rejectWithValue }) => {
  try {
    const response = await updateTaskApi(task.id, task);
    return response?.task || task;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update task.');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    await deleteTaskApi(taskId);
    return taskId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete task.');
  }
});

export const toggleComplete = createAsyncThunk('tasks/toggleComplete', async (taskId, { rejectWithValue }) => {
  try {
    const response = await toggleTask(taskId);
    return response?.task || { id: taskId };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to toggle task.');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasks: (state, action) => {
      state.tasks = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.tasks = [];
        state.error = action.payload || 'Unable to fetch tasks.';
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        const newTask = action.payload;
        if (newTask && !state.tasks.some(task => task.id === newTask.id)) {
          state.tasks.unshift(newTask);
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to add task.';
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        if (!updatedTask) return;
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to update task.';
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to delete task.';
      })
      .addCase(toggleComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleComplete.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        if (!updatedTask) return;
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = {
            ...state.tasks[index],
            ...updatedTask,
            completed: Boolean(updatedTask.completed),
          };
        }
      })
      .addCase(toggleComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unable to toggle task.';
      })
      .addCase(logoutUser, (state) => {
        state.tasks = [];
        state.loading = false;
        state.error = null;
      });
  },
});

export const { loadTasks } = taskSlice.actions;
export default taskSlice.reducer;