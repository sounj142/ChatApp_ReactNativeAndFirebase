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
} from 'firebase/database';
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
    createdDate: new Date().toISOString(),
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
