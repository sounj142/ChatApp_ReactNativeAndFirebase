import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function IconButton({
  name,
  size,
  color,
  onPress,
  style,
  iconStyle,
  text,
  textStyle,
  disabled,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      disabled={disabled}
    >
      <Ionicons name={name} size={size} color={color} style={{ iconStyle }} />
      {!!text && <Text style={textStyle}>{text}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
