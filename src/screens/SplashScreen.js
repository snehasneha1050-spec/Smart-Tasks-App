import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Timer to automatically navigate to the Login screen after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 2500);

    return () => clearTimeout(timer); // Clean up the timer to prevent memory leaks
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Task Manager</Text>
      <Text style={styles.subText}>Manage your tasks efficiently</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200EA', // Professional purple color
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subText: {
    fontSize: 16,
    color: '#E0E0E0',
    marginTop: 10,
  },
});

export default SplashScreen;


