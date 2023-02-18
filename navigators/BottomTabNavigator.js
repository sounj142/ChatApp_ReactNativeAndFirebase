import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../utils/constants';
import ChatListScreen from '../screens/ChatListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({}) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={Screen.ChatList}
        component={ChatListScreen}
        options={{
          headerTitle: 'Home',
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='chatbubble-outline' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={Screen.Settings}
        component={SettingsScreen}
        options={{
          headerTitle: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='settings-outline' color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
