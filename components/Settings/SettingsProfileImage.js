import {
  Image,
  StyleSheet,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import defaultImage from '../../assets/images/userImage.jpeg';
import { Colors } from '../../utils/constants';
import { launchImagePicker } from '../../utils/imagePickerHelper';

export default function SettingsProfileImage({ size, image, setImage }) {
  const [loading, setLoading] = useState(false);

  async function editImageHandler() {
    if (loading) return;
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
      <Image
        source={image ? { uri: image } : defaultImage}
        style={[styles.image, { height: size, width: size }]}
        onLoadStart={imageLoadStartHandler}
        onLoadEnd={imageLoadEndHandler}
      />

      {!loading && (
        <View style={styles.editButton}>
          <Ionicons name='pencil' size={20} color='white' />
        </View>
      )}

      {loading && (
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
    left: '50%',
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
