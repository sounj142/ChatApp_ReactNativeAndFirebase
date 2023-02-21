import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import { useSelector } from 'react-redux';

export default function AppNavigator({}) {
  const isAuth = useSelector((state) => !!state.auth.userData);

  return (
    <NavigationContainer>
      {isAuth ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
