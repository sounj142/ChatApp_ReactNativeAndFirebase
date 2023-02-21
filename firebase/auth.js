import app from './config';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { child, getDatabase, ref, set, get } from 'firebase/database';

export async function signUp({ email, password, firstName, lastName }) {
  const auth = getAuth(app);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const userData = await createUserInRealtimeDatabase(
      user.uid,
      user.email,
      firstName,
      lastName
    );
    return {
      succeed: true,
      userData,
    };
  } catch (err) {
    let errorMsg;
    if (err.code === 'auth/email-already-in-use') {
      errorMsg = 'This email is already in use.';
    } else {
      errorMsg = 'Something went wrong.';
      console.warn({ ...err });
    }
    return {
      succeed: false,
      errorMessage: errorMsg,
    };
  }
}

async function createUserInRealtimeDatabase(
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
    fullNameLowerCase: `${firstName} ${lastName}`.toLowerCase(),
    createdDate: new Date().toISOString(),
  };
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);
  await set(userRef, userData);
  return userData;
}

export async function logIn({ email, password }) {
  const auth = getAuth(app);
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userData = await getUserInRealtimeDatabase(result.user.uid);
    return {
      succeed: true,
      userData: userData,
    };
  } catch (err) {
    let errorMsg;
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password'
    ) {
      errorMsg = 'Invalid email or password.';
    } else {
      errorMsg = 'Something went wrong.';
      console.warn({ ...err });
    }
    return {
      succeed: false,
      errorMessage: errorMsg,
    };
  }
}

async function getUserInRealtimeDatabase(userId) {
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);
  return (await get(userRef))?.val();
}

export async function loadCurrentUser() {
  const currentUser = await new Promise((resolve, reject) => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
  if (!currentUser) return null;
  const userData = await getUserInRealtimeDatabase(currentUser.uid);
  return userData;
}

export async function logOut() {
  const auth = getAuth(app);
  await signOut(auth);
}
