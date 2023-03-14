// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth/react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDo8N3Ogs0y6Zfu42hWk5FELfCHusmAH9o',
  authDomain: 'whatsapp-db11d.firebaseapp.com',
  projectId: 'whatsapp-db11d',
  storageBucket: 'whatsapp-db11d.appspot.com',
  messagingSenderId: '892429687954',
  appId: '1:892429687954:web:747c4be21219d0c8c45a4b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// addition config to fix onAuthStateChanged function. More: https://stackoverflow.com/questions/75572098/expo-sdk-48-broke-firebase-auth
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
