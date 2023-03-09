import { KeyboardAvoidingView } from 'react-native';
import { commonStyles } from '../../utils/styles';
import { IS_IOS } from '../../utils/system';

export default function MyKeyboardAvoidingView({ children, style }) {
  return (
    <KeyboardAvoidingView
      style={[commonStyles.flex1, style]}
      behavior={IS_IOS ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
