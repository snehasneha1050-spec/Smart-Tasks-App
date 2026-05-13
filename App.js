import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import notifee, { EventType } from '@notifee/react-native';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadTasks } from './src/store/taskSlice';
import { loadTasks as loadTasksFromStorage } from './src/utils/storage';
import { CustomAlertProvider } from './src/components/CustomAlert';

// Hide all yellow warnings (Logs)
LogBox.ignoreAllLogs();

const navigationRef = createNavigationContainerRef();

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

  useEffect(() => {
    // యాప్ ఓపెన్/మినిమైజ్ లో ఉన్నప్పుడు నోటిఫికేషన్ నొక్కితే నేరుగా వెళ్లడానికి
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        const taskData = detail.notification?.data?.task;
        if (taskData && navigationRef.isReady()) {
          navigationRef.navigate('TaskDetail', { task: taskData });
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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