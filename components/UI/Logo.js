import { Image, StyleSheet, View } from 'react-native';
import logoImg from '../../assets/images/logo.png';

export default function Logo() {
  return (
    <View style={styles.container}>
      <Image source={logoImg} style={styles.image} resizeMode='contain' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '40%',
    height: 160,
  },
});
