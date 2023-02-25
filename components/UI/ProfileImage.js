import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import defaultImage from '../../assets/images/userImage.jpeg';
import { Colors } from '../../utils/constants';

export default function ProfileImage({ size, image, style }) {
  const [loading, setLoading] = useState(false);

  function imageLoadStartHandler() {
    setLoading(true);
  }

  function imageLoadEndHandler() {
    setLoading(false);
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={image ? { uri: image } : defaultImage}
        style={[styles.image, { height: size, width: size }]}
        onLoadStart={imageLoadStartHandler}
        onLoadEnd={imageLoadEndHandler}
      />

      {loading && (
        <View style={[styles.loadingContainer, { width: size, height: size }]}>
          <ActivityIndicator size={20} color={Colors.primary} />
        </View>
      )}
    </View>
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
  loadingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
