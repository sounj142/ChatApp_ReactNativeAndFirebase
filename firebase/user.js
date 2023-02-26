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
} from 'firebase/database';

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
    imageUri: userData.imageUri,
  });
  return userData;
}

export async function getUserInRealtimeDatabase(userId) {
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);
  return (await get(userRef))?.val();
}

export async function searchUsers(searchText) {
  searchText = searchText.toLowerCase();
  try {
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
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function observeUserChange(userId) {
//   const dbRef = ref(getDatabase(app));
//   const userRef = child(dbRef, `users/${userId}`);

//   onValue(userRef, (snapshot) => {
//     const data = snapshot.val();
//     console.log('user data changed!', data);
//   });
// }
