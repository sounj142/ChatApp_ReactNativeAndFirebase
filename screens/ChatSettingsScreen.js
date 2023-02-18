import { StyleSheet, Text, View } from 'react-native';

export default function ChatSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>chat settings!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontFamily: 'bold',
    color: 'black',
  },
});
