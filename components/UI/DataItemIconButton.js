import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils/constants';

export default function DataItemIconButton({ title, onPress, icon, color }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: color }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
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
  iconContainer: {
    backgroundColor: Colors.extraLightGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
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
