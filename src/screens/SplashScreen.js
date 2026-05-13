import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice';
import { loadTasks } from '../store/taskSlice';
import { loadUserTasks } from '../utils/storage';
import notifee from '@notifee/react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const dispatch = useDispatch();

  useEffect(() => {
    // Start Logo Animations
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

    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        
        setTimeout(async () => {
          if (loggedInUser) {
            const userTasks = await loadUserTasks(loggedInUser);
            dispatch(loadTasks(userTasks));
            dispatch(loginUser(loggedInUser));
            
            // If the app is opened via a notification when completely closed...
            const initialNotification = await notifee.getInitialNotification();
            const taskFromNotification = initialNotification?.notification?.data?.task;

            navigation.replace('MainTabs'); // Navigate to the Home page first
            
            // If there is notification data, navigate to that task's details
            if (taskFromNotification) {
              setTimeout(() => navigation.navigate('TaskDetail', { task: taskFromNotification }), 100);
            }
          } else {
            navigation.replace('Login');
          }
        }, 2000); // 2 seconds delay to show Splash Screen
      } catch (error) {
        console.error('Auto-login check failed:', error);
        navigation.replace('Login');
      }
    };

    checkLoginStatus();
  }, [navigation, fadeAnim, scaleAnim, dispatch]);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoContainer, 
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
      ]}>
        {/* App Logo Placeholder */}
        <View style={styles.iconBackground}>
          <Text style={styles.iconText}>✓</Text>
        </View>
        
        {/* App Name & Tagline */}
        <Text style={styles.logoText}>Smart Tasks</Text>
        <Text style={styles.subText}>Manage your tasks efficiently</Text>
      </Animated.View>

      {/* Loading Indicator at the bottom */}
      <Animated.View style={[styles.loaderContainer, { opacity: fadeAnim }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200EA',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconBackground: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  iconText: {
    fontSize: 60,
    color: '#6200EA',
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
  },
});

export default SplashScreen;
