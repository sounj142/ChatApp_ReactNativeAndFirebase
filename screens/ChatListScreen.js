import { Button, StyleSheet, Text, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useLayoutEffect } from 'react';
import { Screens } from '../utils/constants';
import IoniconsHeaderButton from '../components/UI/IoniconsHeaderButton';

export default function ChatListScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title='New chat'
            iconName='create-outline'
            onPress={() => navigation.navigate(Screens.NewChat)}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chat list home</Text>
      <Button title='Chat' onPress={() => navigation.navigate(Screens.Chat)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontFamily: 'bold',
    color: 'black',
  },
});
