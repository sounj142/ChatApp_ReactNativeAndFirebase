import { StyleSheet, Text, View } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

export default function MenuItem({ text, onSelect, iconPack, icon }) {
  const Icon = iconPack ?? Ionicons;
  return (
    <MenuOption onSelect={onSelect}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        {icon && <Icon name={icon} size={18} />}
      </View>
    </MenuOption>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
  },
  text: {
    flex: 1,
    fontFamily: 'regular',
    letterSpacing: 0.3,
    fontSize: 16,
  },
});
