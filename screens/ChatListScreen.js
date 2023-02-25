import { Button, StyleSheet, Text, View } from 'react-native';
import { Screens } from '../utils/constants';

export default function ChatListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chat list home</Text>
      <Button title='Chat' onPress={() => navigation.navigate(Screens.Chat)} />
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
