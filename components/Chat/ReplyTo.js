import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../../utils/constants';

export default function ReplyTo({ text, user, onCancel }) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {user.fullName}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>

      <TouchableOpacity>
        <AntDesign
          name='closecircleo'
          size={24}
          color={Colors.blue}
          onPress={onCancel}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.extraLightGrey,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: Colors.blue,
    borderLeftWidth: 5,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    color: Colors.blue,
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
});
