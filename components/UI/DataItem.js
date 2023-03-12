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
  notPressable,
  type,
  icon,
  iconColor,
  onIconPress,
  isChecked,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        !notPressable && pressed && styles.containerPressed,
      ]}
      onPress={() => !notPressable && onPress && onPress()}
    >
      <ProfileImage image={imageUri} defaultImage={defaultImage} size={40} />

      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {!!subTitle && (
          <Text style={styles.subTitle} numberOfLines={1}>
            {subTitle}
          </Text>
        )}
      </View>

      {type === 'checkbox' && (
        <View
          style={[styles.checkboxContainer, isChecked && styles.checkedStyle]}
        >
          <Ionicons name='checkmark' size={18} color='white' />
        </View>
      )}

      {icon && (
        <View>
          <Ionicons
            name={icon}
            size={18}
            color={iconColor ?? Colors.grey}
            onPress={onIconPress}
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
