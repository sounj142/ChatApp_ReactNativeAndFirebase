import {
  Image,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import userImage from '../../assets/images/userImage.jpeg';
import { Colors } from '../../utils/constants';
import { launchImagePicker } from '../../utils/imagePickerHelper';

export default function SettingsProfileImage({
  size,
  image,
  setImage,
  defaultImage,
  parentSubmitting,
}) {
  const [loading, setLoading] = useState(false);
  const isLoading = loading || parentSubmitting;

  async function editImageHandler() {
    if (isLoading) return;
    const img = await launchImagePicker();
    if (!img) return;
    setImage(img);
  }

  function imageLoadStartHandler() {
    setLoading(true);
  }

  function imageLoadEndHandler() {
    setLoading(false);
  }

  return (
    <Pressable
      onPress={editImageHandler}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View>
        <Image
          source={image ? { uri: image } : defaultImage || userImage}
          style={[styles.image, { height: size, width: size }]}
          onLoadStart={imageLoadStartHandler}
          onLoadEnd={imageLoadEndHandler}
        />

        {!isLoading && (
          <View style={styles.editButton}>
            <Ionicons name='pencil' size={20} color='white' />
          </View>
        )}
      </View>

      {isLoading && (
        <View style={[styles.loadingContainer, { width: size, height: size }]}>
          <ActivityIndicator size={20} color={Colors.primary} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  image: {
    borderRadius: 500,
    borderColor: Colors.grey,
    borderWidth: 1,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: Colors.blue,
    borderRadius: 20,
    padding: 6,
  },
  loadingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
