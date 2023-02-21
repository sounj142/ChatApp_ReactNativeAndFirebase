import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Provider, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import AppNavigator from './navigators/AppNavigator';
import { LogBox, View } from 'react-native';
import { store } from './store/store';
import { loadCurrentUser } from './firebase/auth';
import { authenticate } from './store/authSlice';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core']);

async function loadFonts() {
  try {
    await Font.loadAsync({
      black: require('./assets/fonts/Roboto-Black.ttf'),
      blackItalic: require('./assets/fonts/Roboto-BlackItalic.ttf'),
      bold: require('./assets/fonts/Roboto-Bold.ttf'),
      boldItalic: require('./assets/fonts/Roboto-BoldItalic.ttf'),
      italic: require('./assets/fonts/Roboto-Italic.ttf'),
      light: require('./assets/fonts/Roboto-Light.ttf'),
      lightItalic: require('./assets/fonts/Roboto-LightItalic.ttf'),
      medium: require('./assets/fonts/Roboto-Medium.ttf'),
      mediumItalic: require('./assets/fonts/Roboto-MediumItalic.ttf'),
      regular: require('./assets/fonts/Roboto-Regular.ttf'),
      thin: require('./assets/fonts/Roboto-Thin.ttf'),
      thinItalic: require('./assets/fonts/Roboto-ThinItalic.ttf'),
    });
  } catch (e) {
    console.warn(e);
  }
}

async function loadCurrentUserFromAsyncStorage(dispatch) {
  const userData = await loadCurrentUser();
  if (userData) dispatch(authenticate({ userData }));
}

export default function App() {
  return (
    <Provider store={store}>
      <AppRoot />
    </Provider>
  );
}

function AppRoot() {
  const [appIsReady, setAppIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await Promise.all([
        loadFonts(),
        loadCurrentUserFromAsyncStorage(dispatch),
      ]);
      setAppIsReady(true);
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style='dark' />
      <AppNavigator />
    </View>
  );
}
