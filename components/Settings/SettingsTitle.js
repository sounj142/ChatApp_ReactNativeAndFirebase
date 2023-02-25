import { StyleSheet, Text, View } from 'react-native';
import { logOut } from '../../firebase/auth';
import { Colors } from '../../utils/constants';
import MyButton from '../UI/MyButton';
import { logOut as logOutAction } from '../../store/authSlice';
import { useDispatch } from 'react-redux';

export default function SettingsTitle() {
  const dispatch = useDispatch();

  async function logOutHandler() {
    await logOut();
    dispatch(logOutAction());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <MyButton style={styles.logOutButton} onPress={logOutHandler}>
        Log Out
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: Colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.3,
  },
  logOutButton: {
    marginTop: 20,
    backgroundColor: Colors.red,
    width: 100,
  },
});
