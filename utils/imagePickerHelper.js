import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function launchImagePicker() {
  if (!(await checkMediaPermissions())) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return null;
}

async function checkMediaPermissions() {
  const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!result.granted) {
    Alert.alert(
      'Permission denied',
      'You must grant photo permission to upload image to your profile.'
    );
    return false;
  }
  return true;
}

export function transformToBlob(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.warn(e);
      reject(new Error('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
}
