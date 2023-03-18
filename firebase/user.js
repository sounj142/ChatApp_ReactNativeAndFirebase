import app from './config';
import {
  child,
  getDatabase,
  ref,
  set,
  get,
  update,
  query,
  orderByChild,
  startAt,
  endAt,
  onValue,
  serverTimestamp,
} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';
import { authenticate } from '../store/authSlice';

function getFullNameLowerCase(firstName, lastName) {
  return `${firstName} ${lastName}`.toLowerCase();
}

export async function createUserInRealtimeDatabase(
  userId,
  email,
  firstName,
  lastName
) {
  const userData = {
    userId,
    email,
    firstName,
    lastName,
    fullNameLowerCase: getFullNameLowerCase(firstName, lastName),
    createdDate: serverTimestamp(),
  };
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);
  await set(userRef, userData);
  return userData;
}

export async function updateUserInRealtimeDatabase(userData) {
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userData.userId}`);
  await update(userRef, {
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    fullNameLowerCase: getFullNameLowerCase(
      userData.firstName,
      userData.lastName
    ),
    about: userData.about,
    imageUri: userData.imageUri || null,
  });
  return userData;
}

export async function getUserInRealtimeDatabase(userId) {
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);
  const snapshot = await get(userRef);
  return snapshot?.val();
}

export async function searchUsers(searchText) {
  searchText = searchText.toLowerCase();

  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, 'users');
  const queryRef = query(
    userRef,
    orderByChild('fullNameLowerCase'),
    startAt(searchText),
    endAt(searchText + '\uf8ff')
  );
  const snapshot = await get(queryRef);

  if (!snapshot.exists()) return null;
  return snapshot.val();
}

export async function getUsersByIds(userIds) {
  const dbRef = ref(getDatabase(app));

  const promises = userIds.map((userId) => {
    const userRef = child(dbRef, `users/${userId}`);
    return get(userRef);
  });
  const snapshots = await Promise.all(promises);
  const users = snapshots.map((snapshot) => snapshot.val());

  return users;
}

export function observeUserChange(userId) {
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);

  return onValue(userRef, (snapshot) => {
    const userData = snapshot.val();
    store.dispatch(authenticate({ userData: userData }));
  });
}

const CURRENT_USER_ID = 'CURRENT_USER_ID';
const PUSH_TOKEN_KEY = 'PUSH_TOKEN_KEY';

function getTokenKey(token) {
  return token.replaceAll('[', '').replaceAll(']', '');
}

async function removePushToken(userId, tokenKey) {
  const dbRef = ref(getDatabase(app));
  const tokensRef = child(dbRef, `users/${userId}/pushTokens`);

  const snapshot = await get(tokensRef);
  const pushTokens = snapshot.val();
  if (!pushTokens || !pushTokens[tokenKey]) {
    return;
  }

  delete pushTokens[tokenKey];
  await set(tokensRef, pushTokens);
}

export async function storePushToken(userData, token) {
  if (!token) {
    return;
  }
  const currentTokens = userData.pushTokens || {};
  const tokenKey = getTokenKey(token);

  const lastLoginUserId = await AsyncStorage.getItem(CURRENT_USER_ID);
  if (lastLoginUserId && lastLoginUserId !== userData.userId) {
    // if other account logged in before in this device, we need to remove this token from that account
    await removePushToken(lastLoginUserId, tokenKey);
  }
  // save userId to storage
  await AsyncStorage.setItem(CURRENT_USER_ID, userData.userId);
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, tokenKey);

  if (currentTokens[tokenKey]) {
    return;
  }

  // add token to exiting tokens of user userData
  const newTokens = { ...currentTokens, [tokenKey]: token };

  // save tokens to db
  const dbRef = ref(getDatabase(app));
  const tokensRef = child(dbRef, `users/${userData.userId}/pushTokens`);
  await set(tokensRef, newTokens);
}

export async function removeCurrentUserPushToken() {
  const tokenKey = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  if (!tokenKey) {
    return;
  }
  const userId = await AsyncStorage.getItem(CURRENT_USER_ID);

  if (userId) {
    await removePushToken(userId, tokenKey);
  }

  await AsyncStorage.removeItem(CURRENT_USER_ID);
  await AsyncStorage.removeItem(PUSH_TOKEN_KEY);
}
