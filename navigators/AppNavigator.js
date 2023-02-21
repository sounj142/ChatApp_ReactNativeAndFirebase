import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadCurrentUser } from '../firebase/auth';
import { authenticate } from '../store/authSlice';
import StartUpScreen from '../screens/StartUpScreen';

export default function AppNavigator({}) {
  const isAuth = useSelector((state) => !!state.auth.userData);
  const dispatch = useDispatch();
  const [initializedApp, setInitializedApp] = useState(false);

  useEffect(() => {
    (async () => {
      const userData = await loadCurrentUser();
      if (userData) dispatch(authenticate({ userData }));
      setInitializedApp(true);
    })();
  }, []);

  if (!initializedApp) return <StartUpScreen />;

  return (
    <NavigationContainer>
      {isAuth ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
