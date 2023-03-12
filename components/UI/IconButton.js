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
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
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
