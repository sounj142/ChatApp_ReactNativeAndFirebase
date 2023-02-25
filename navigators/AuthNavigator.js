import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Screens } from '../utils/constants';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Screens.LogIn}
        component={LogInScreen}
        options={{ freezeOnBlur: false }}
      />
      <Stack.Screen name={Screens.SignUp} component={SignUpScreen} />
    </Stack.Navigator>
  );
}
