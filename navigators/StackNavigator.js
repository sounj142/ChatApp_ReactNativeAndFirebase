import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screens } from '../utils/constants';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ChatScreen from '../screens/ChatScreen';
import NewChatScreen from '../screens/NewChatScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitle: '' }}>
      <Stack.Group>
        <Stack.Screen
          name={Screens.Home}
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={Screens.Chat}
          component={ChatScreen}
          options={{ headerTitle: '' }}
        />

        <Stack.Screen
          name={Screens.ChatSettings}
          component={ChatSettingsScreen}
          options={{ headerTitle: 'Settings' }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: 'containedModal' }}>
        <Stack.Screen name={Screens.NewChat} component={NewChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
