/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// బ్యాక్‌గ్రౌండ్ లో నోటిఫికేషన్స్ క్రాష్ అవ్వకుండా ఉండటానికి
notifee.onBackgroundEvent(async ({ type, detail }) => {
  // బ్యాక్‌గ్రౌండ్ లో మనం డైరెక్ట్ నావిగేట్ చేయలేము కాబట్టి దీన్ని ఖాళీగా ఉంచాలి
});

AppRegistry.registerComponent(appName, () => App);
