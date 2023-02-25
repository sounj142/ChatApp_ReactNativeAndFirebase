import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../utils/constants';
import ProfileImage from './ProfileImage';

export default function UserItem({ title, subTitle, imageUri, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      <ProfileImage image={imageUri} size={40} />

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subTitle} numberOfLines={1}>
          {subTitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: Colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  containerPressed: {
    opacity: 0.7,
  },
  textContainer: {
    marginLeft: 14,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subTitle: {
    fontFamily: 'regular',
    color: Colors.grey,
    letterSpacing: 0.3,
  },
});
