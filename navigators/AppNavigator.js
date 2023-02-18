import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';

export default function AppNavigator({}) {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
