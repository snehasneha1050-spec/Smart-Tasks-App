import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';
import { setPreferences } from '../store/themeSlice';
import { fetchTasks } from '../store/taskSlice';
import { getSavedSession, clearSavedSession } from '../utils/storage';
import notifee from '@notifee/react-native';
import { useAppStyles } from '../hooks/useAppStyles';
import { setAuthToken } from '../services/api';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const dispatch = useDispatch();
  const styles = useAppStyles();

  useEffect(() => {
    let isActive = true;

    if (process.env.NODE_ENV === 'test') {
      return () => {
        isActive = false;
      };
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();

    const checkLoginStatus = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (!isActive) return;

        const savedSession = await getSavedSession();

        if (savedSession?.username && savedSession?.sessionToken) {
          setAuthToken(savedSession.sessionToken);
          dispatch(setPreferences({
            darkMode: false,
            language: 'English',
            notificationsEnabled: true,
          }));
          dispatch(loginUser({ username: savedSession.username, sessionToken: savedSession.sessionToken }));
          dispatch(fetchTasks());

          if (!isActive) return;
          navigation.replace('MainTabs');

          const initialNotification = await notifee.getInitialNotification();
          const taskFromNotification = initialNotification?.notification?.data?.task;
          if (taskFromNotification && isActive) {
            setTimeout(() => {
              if (isActive) {
                navigation.navigate('TaskDetail', { task: taskFromNotification });
              }
            }, 100);
          }
          return;
        }

        if (!isActive) return;
        await clearSavedSession();
        navigation.replace('Login');
      } catch (error) {
        if (!isActive) return;
        console.error('Auto-login check failed:', error);
        await clearSavedSession();
        navigation.replace('Login');
      }
    };

    checkLoginStatus();

    return () => {
      isActive = false;
    };
  }, [navigation, fadeAnim, scaleAnim, dispatch]);

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[
        styles.splashLogoContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        {/* App Logo Placeholder */}
        <View style={styles.splashIconBackground}>
          <Text style={styles.splashIconText}>✓</Text>
        </View>

        {/* App Name & Tagline */}
        <Text style={styles.splashLogoText}>Smart Tasks</Text>
        <Text style={styles.splashSubText}>Manage your tasks efficiently</Text>
      </Animated.View>

      {/* Loading Indicator at the bottom */}
      <Animated.View style={[styles.splashLoaderContainer, { opacity: fadeAnim }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
