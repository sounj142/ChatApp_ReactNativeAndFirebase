import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Screens } from '../../utils/constants';

export default function ChatListHeader({ navigation }) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Chats</Text>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(Screens.NewChat, { isGroupChat: true })
        }
      >
        <Text style={styles.newGroupText}>New Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 28,
    color: Colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.3,
  },
  newGroupText: {
    color: Colors.blue,
    fontSize: 17,
    marginBottom: 5,
    textAlign: 'right',
  },
});
