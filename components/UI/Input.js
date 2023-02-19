import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export default function Input({
  label,
  icon,
  isPassword,
  value,
  onChangeText,
  onBlur,
  onSubmitEditing,
  errorMessage,
  iconSize,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.textInputContainer}>
        {icon && (
          <Ionicons name={icon} size={iconSize || 24} style={styles.icon} />
        )}

        <TextInput
          style={styles.textInput}
          value={value}
          secureTextEntry={!!isPassword}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
        />
      </View>

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginVertical: 8,
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: Colors.textColor,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.nearlyWhite,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
  },
  icon: {
    marginRight: 10,
    color: Colors.grey,
  },
  textInput: {
    flex: 1,
    color: Colors.textColor,
    fontFamily: 'regular',
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  errorContainer: {
    marginVertical: 5,
  },
  error: {
    color: 'red',
    fontSize: 13,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});
