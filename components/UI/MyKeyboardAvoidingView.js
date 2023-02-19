import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { IS_IOS } from '../../utils/system';

export default function MyKeyboardAvoidingView({ children, style }) {
  return (
    <KeyboardAvoidingView
      style={[styles.flex1, style]}
      behavior={IS_IOS ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
