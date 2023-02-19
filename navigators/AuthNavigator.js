import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { Screens } from '../utils/constants';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';

const Stack = createStackNavigator();

export default function AuthNavigator({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={Screens.LogIn} component={LogInScreen} />
      <Stack.Screen name={Screens.SignUp} component={SignUpScreen} />
    </Stack.Navigator>
  );
}
