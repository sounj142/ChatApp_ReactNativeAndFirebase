import { Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { logOut } from '../firebase/auth';
import { authenticate } from '../store/authSlice';
import { Screens } from '../utils/constants';

export default function ChatListScreen({ navigation }) {
  const dispatch = useDispatch();
  async function logOutHandler() {
    await logOut();
    dispatch(authenticate({ userData: null }));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chat list home</Text>
      <Button title='Chat' onPress={() => navigation.navigate(Screens.Chat)} />
      <Button title='Log Out' onPress={logOutHandler} />
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
