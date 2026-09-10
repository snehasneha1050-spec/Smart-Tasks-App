/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Prevent notification handling from crashing in the background.
notifee.onBackgroundEvent(async () => {
  // Keep this empty because direct navigation is unavailable in the background.
});

AppRegistry.registerComponent(appName, () => App);
