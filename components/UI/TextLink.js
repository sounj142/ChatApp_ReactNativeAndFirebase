import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '../../utils/constants';

export default function TextLink({ children, onPress, style, textStyle }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: Colors.blue,
    textDecorationLine: 'underline',
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
});
