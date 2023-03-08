import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import defaultImage from '../../assets/images/userImage.jpeg';
import { Colors } from '../../utils/constants';

export default function ProfileImage({
  size,
  image,
  style,
  onPress,
  showRemoveIcon,
}) {
  const [loading, setLoading] = useState(false);

  function imageLoadStartHandler() {
    setLoading(true);
  }

  function imageLoadEndHandler() {
    setLoading(false);
  }

  const Container = onPress ? Pressable : View;

  return (
    <Container style={[styles.container, style]} onPress={onPress}>
      <Image
        source={image ? { uri: image } : defaultImage}
        style={[styles.image, { height: size, width: size }]}
        onLoadStart={imageLoadStartHandler}
        onLoadEnd={imageLoadEndHandler}
      />

      {!loading && showRemoveIcon && (
        <View style={styles.removeIconContainer}>
          <Ionicons name='close' size={20} color='black' />
        </View>
      )}

      {loading && (
        <View style={[styles.loadingContainer, { width: size, height: size }]}>
          <ActivityIndicator size={20} color={Colors.primary} />
        </View>
      )}
    </Container>
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
  removeIconContainer: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    padding: 0,
  },
  loadingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
