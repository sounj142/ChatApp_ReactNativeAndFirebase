import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Screens } from '../utils/constants';
import ChatListScreen from '../screens/ChatListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: '',
        headerShadowVisible: true,
      }}
    >
      <Tab.Screen
        name={Screens.ChatList}
        component={ChatListScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='chatbubble-outline' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={Screens.Settings}
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='settings-outline' color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
