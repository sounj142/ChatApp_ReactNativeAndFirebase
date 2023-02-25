import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../utils/constants';

export default function PageTitle({ title, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: Colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.3,
  },
});
