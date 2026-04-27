import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

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

    // Timer to automatically navigate to the Login screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

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
