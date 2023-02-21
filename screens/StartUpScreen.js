import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../utils/constants';

export default function StartUpScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
