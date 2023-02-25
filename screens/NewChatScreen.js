import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useEffect, useLayoutEffect, useState } from 'react';
import IoniconsHeaderButton from '../components/UI/IoniconsHeaderButton';
import PageContainer from '../components/UI/PageContainer';
import { Colors } from '../utils/constants';
import { searchUsers } from '../firebase/user';
import ChatListContent from '../components/ChatList/ChatListContent';

export default function NewChatScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchText) {
        setUsers(null);
        return;
      }
      setIsLoading(true);

      const usersResult = await searchUsers(searchText);
      setUsers(usersResult);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchText]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item title='Close' onPress={() => navigation.goBack()} />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  return (
    <PageContainer ignoreTop isView>
      <View style={styles.searchContainer}>
        <Ionicons
          name='search'
          size={18}
          color='black'
          style={styles.searchIcon}
        />

        <TextInput
          placeholder='Search'
          style={styles.searchBox}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      <ChatListContent
        searchText={searchText}
        users={users}
        isLoading={isLoading}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.extraLightGrey,
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 15,
    width: '100%',
  },
});
