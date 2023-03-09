import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils/constants';
import ProfileImage from './ProfileImage';

export default function DataItem({
  title,
  subTitle,
  imageUri,
  defaultImage,
  onPress,
  type,
  isChecked,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      <ProfileImage image={imageUri} defaultImage={defaultImage} size={40} />

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.subTitle} numberOfLines={1}>
          {subTitle}
        </Text>
      </View>

      {type === 'checkbox' && (
        <View
          style={[styles.checkboxContainer, isChecked && styles.checkedStyle]}
        >
          <Ionicons name='checkmark' size={18} color='white' />
        </View>
      )}

      {type === 'link' && (
        <View>
          <Ionicons
            name='chevron-forward-outline'
            size={18}
            color={Colors.grey}
          />
        </View>
      )}
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
    flex: 1,
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
  checkboxContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Colors.lightGrey,
    backgroundColor: 'white',
  },
  checkedStyle: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
});
