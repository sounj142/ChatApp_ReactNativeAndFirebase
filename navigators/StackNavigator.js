import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screens } from '../utils/constants';
import ChatSettingsScreen from '../screens/ChatSettingsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ChatScreen from '../screens/ChatScreen';
import NewChatScreen from '../screens/NewChatScreen';
import ContactScreen from '../screens/ContactScreen';
import UsersInGroupScreen from '../screens/UsersInGroupScreen';
import AddUsersToGroupScreen from '../screens/AddUsersToGroupScreen';
import StarredMessagesScreen from '../screens/StarredMessagesScreen';

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
          name={Screens.Contact}
          component={ContactScreen}
          options={{ headerTitle: 'Contact Info' }}
        />

        <Stack.Screen
          name={Screens.ChatSettings}
          component={ChatSettingsScreen}
          options={{ headerTitle: '' }}
        />

        <Stack.Screen
          name={Screens.UsersInGroup}
          component={UsersInGroupScreen}
          options={{ headerTitle: '' }}
        />

        <Stack.Screen
          name={Screens.StarredMessages}
          component={StarredMessagesScreen}
          options={{ headerTitle: '' }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: 'containedModal' }}>
        <Stack.Screen name={Screens.NewChat} component={NewChatScreen} />

        <Stack.Screen
          name={Screens.AddUsersToGroup}
          component={AddUsersToGroupScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
