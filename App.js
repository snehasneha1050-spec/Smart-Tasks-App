import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import notifee, { EventType } from '@notifee/react-native';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { logoutUser } from './src/store/userSlice';
import { clearSavedSession } from './src/utils/storage';
import { CustomAlertProvider } from './src/components/CustomAlert';

// Hide all yellow warnings (Logs)
LogBox.ignoreAllLogs();

const navigationRef = createNavigationContainerRef();

function AppContent() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const username = useSelector((state) => state.user.username);
  const sessionToken = useSelector((state) => state.user.sessionToken);

  useEffect(() => {
    if (!navigationRef.isReady()) return;

    const unsubscribe = navigationRef.addListener('state', async () => {
      const currentRoute = navigationRef.getCurrentRoute();
      const protectedRoutes = ['MainTabs', 'AddTask', 'TaskDetail', 'EditTask'];

      if (!currentRoute || !protectedRoutes.includes(currentRoute.name)) {
        return;
      }

      if (!isLoggedIn || !username || !sessionToken) {
        await clearSavedSession();
        dispatch(logoutUser());
        navigationRef.navigate('Login');
        return;
      }

      // JWT-based session is checked during login and app startup.
      // The route guard here only ensures a valid token exists before protected screens are shown.
      if (!sessionToken) {
        await clearSavedSession();
        dispatch(logoutUser());
        navigationRef.navigate('Login');
      }
    });

    return unsubscribe;
  }, [dispatch, isLoggedIn, username, sessionToken]);

  useEffect(() => {
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
      <CustomAlertProvider>
        <AppContent />
      </CustomAlertProvider>
    </Provider>
  );
}