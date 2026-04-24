import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadTasks } from './src/store/taskSlice';
import { loadTasks as loadTasksFromStorage } from './src/utils/storage';
import { CustomAlertProvider } from './src/components/CustomAlert';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load persisted tasks on app startup
    const initializeTasks = async () => {
      const persistedTasks = await loadTasksFromStorage();
      if (persistedTasks && persistedTasks.length > 0) {
        dispatch(loadTasks(persistedTasks));
      }
    };
    
    initializeTasks();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <CustomAlertProvider />
    </Provider>
  );
}