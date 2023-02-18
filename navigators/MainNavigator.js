import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Screen } from '../utils/constants';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

export default function MainNavigator({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: '',
      }}
    >
      <Stack.Screen
        name={Screen.Home}
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={Screen.ChatSettings}
        component={ChatSettingsScreen}
        options={{
          headerTitle: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
}
