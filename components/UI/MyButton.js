import { Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../utils/constants';

export default function MyButton({
  children,
  onPress,
  isLoading,
  disabled,
  style,
  textStyle,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        disabled && styles.containerDisabled,
        pressed && styles.pressed,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      {!isLoading && (
        <Text style={[styles.text, disabled && styles.textDisabled, textStyle]}>
          {children}
        </Text>
      )}
      {isLoading && <ActivityIndicator size={21} color={Colors.nearlyWhite} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    padding: 8,
    backgroundColor: Colors.primary,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
  },
  containerDisabled: {
    backgroundColor: Colors.lightGrey,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
  },
  textDisabled: {
    color: Colors.grey,
  },
  pressed: {
    opacity: 0.75,
  },
});
