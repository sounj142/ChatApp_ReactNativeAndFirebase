import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../utils/constants';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

export default function MainNavigator({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: '',
      }}
    >
      <Stack.Screen
        name={Screens.Home}
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={Screens.Chat}
        component={ChatScreen}
        options={{
          headerTitle: '',
        }}
      />

      <Stack.Screen
        name={Screens.ChatSettings}
        component={ChatSettingsScreen}
        options={{
          headerTitle: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
}
