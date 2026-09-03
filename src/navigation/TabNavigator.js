import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Import the screens that will be inside the bottom tabs
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAppStyles } from '../hooks/useAppStyles';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, routeName, styles }) => {
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

const renderTabBarIcon = ({ route, focused, styles }) => (
  <TabBarIcon focused={focused} routeName={route.name} styles={styles} />
);

const TabNavigator = () => {
  const styles = useAppStyles();
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => renderTabBarIcon({ route, focused, styles }),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;