import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

// Import the screens that will be inside the bottom tabs
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, routeName }) => {
  let iconEmoji;
  if (routeName === 'Home') iconEmoji = '🏠';
  else if (routeName === 'Profile') iconEmoji = '👤';
  else if (routeName === 'Settings') iconEmoji = '⚙️';

  return (
    <Text style={focused ? styles.tabIconFocused : styles.tabIcon}>
      {iconEmoji}
    </Text>
  );
};

const getTabBarIcon = (routeName) => ({ focused }) => (
  <TabBarIcon focused={focused} routeName={routeName} />
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: '#6200EA',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderColor: '#E5E7EB',
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 24,
    opacity: 0.4,
  },
  tabIconFocused: {
    fontSize: 24,
    opacity: 1,
  },
});

export default TabNavigator;