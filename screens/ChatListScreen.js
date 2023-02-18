import { Button, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../utils/constants';

export default function ChatListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hello me cong hoa!</Text>
      <Button
        title='Chat Settings'
        onPress={() => navigation.navigate(Screen.ChatSettings)}
      />
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
