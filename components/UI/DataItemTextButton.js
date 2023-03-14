import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils/constants';

export default function DataItemTextButton({
  title,
  titleStyle,
  onPress,
  icon,
  iconColor,
  onIconPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>

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
});
