import app from './config';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { child, getDatabase, ref, set, get, update } from 'firebase/database';
import { deleteImageAsync, uploadImageAsync } from './storage';

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
      errorMsg = 'Email is already in use.';
    } else {
      errorMsg = 'Something went wrong.';
      console.warn({ ...err, message: err.message });
    }
    return {
      succeed: false,
      errorMessage: errorMsg,
    };
  }
}

function getFullNameLowerCase(firstName, lastName) {
  return `${firstName} ${lastName}`.toLowerCase();
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
    fullNameLowerCase: getFullNameLowerCase(firstName, lastName),
    createdDate: new Date().toISOString(),
  };
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);
  await set(userRef, userData);
  return userData;
}

export async function updateUser(userData, oldUserData) {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  try {
    if (userData.email !== currentUser.email) {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        userData.password
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, userData.email);
    }

    const uploadNewImage = userData.imageUri !== oldUserData.imageUri;
    if (uploadNewImage) {
      userData.imageUri = await uploadImageAsync(userData.imageUri);
    }

    await updateUserInRealtimeDatabase(userData);
    const updatedUserData = await getUserInRealtimeDatabase(userData.userId);

    if (uploadNewImage) {
      await deleteImageAsync(oldUserData.imageUri);
    }
    return {
      succeed: true,
      userData: updatedUserData,
    };
  } catch (err) {
    let errorMsg;
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password'
    ) {
      errorMsg = 'Invalid email or password.';
    } else if (err.code === 'auth/email-already-in-use') {
      errorMsg = 'Email is already in use.';
    } else {
      errorMsg = 'Something went wrong.';
      console.warn({ ...err, message: err.message });
    }
    return {
      succeed: false,
      errorMessage: errorMsg,
    };
  }
}

async function updateUserInRealtimeDatabase(userData) {
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
      console.warn({ ...err, message: err.message });
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
