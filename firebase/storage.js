import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import uuid from 'uuid';
import app from './config';
import { transformToBlob } from '../utils/imagePickerHelper';

const PROFILE_FOLDER = 'ProfileImages';

export async function uploadImageAsync(uri, folder = undefined) {
  const blob = await transformToBlob(uri);

  const fileRef = ref(
    getStorage(app),
    `${folder || PROFILE_FOLDER}/${uuid.v4()}`
  );
  await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(fileRef);
}

export async function uploadChatImageAsync(uri, chatId) {
  return await uploadImageAsync(uri, `ChatImages/${chatId}`);
}

export async function deleteImageAsync(uri) {
  try {
    const fileRef = ref(getStorage(app), uri);
    await deleteObject(fileRef);
  } catch (error) {
    console.log(error.message);
  }
}
