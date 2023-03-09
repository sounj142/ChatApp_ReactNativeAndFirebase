import { StyleSheet, Text, View } from 'react-native';
import { commonStyles } from '../utils/styles';

export default function ChatSettingsScreen() {
  return (
    <View style={commonStyles.center}>
      <Text style={styles.label}>chat settings!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontFamily: 'bold',
    color: 'black',
  },
});
