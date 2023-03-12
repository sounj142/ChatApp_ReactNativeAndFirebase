import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import IoniconsHeaderButton from '../components/UI/IoniconsHeaderButton';
import PageContainer from '../components/UI/PageContainer';
import { Colors, Screens } from '../utils/constants';
import { searchUsers } from '../firebase/user';
import ChatListContent from '../components/ChatList/ChatListContent';
import { useDispatch, useSelector } from 'react-redux';
import { setStoredUsers } from '../store/usersSlice';
import ProfileImage from '../components/UI/ProfileImage';

export default function NewChatScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const isGroupChat = route.params?.isGroupChat;
  const userData = useSelector((state) => state.auth.userData);
  const chatsData = useSelector((state) => state.chats.chatsData);

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const isDisableCreateGroup = !(
    groupName.trim().length && selectedUsers.length
  );
  const flatListRef = useRef(null);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchText) {
        setUsers(null);
        return;
      }
      setIsLoading(true);

      let usersResult = await searchUsers(searchText);
      dispatch(setStoredUsers({ ...usersResult }));

      if (usersResult) {
        delete usersResult[userData.userId];
        if (!Object.keys(usersResult).length) usersResult = null;
      }
      setUsers(usersResult);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const createPressHandler = () => {
    navigation.navigate(Screens.Chat, {
      selectedUsersId: [...selectedUsers.map((u) => u.userId), userData.userId],
      groupName: groupName.trim(),
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: isGroupChat ? 'Add Participants' : 'New Chat',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item title='Close' onPress={() => navigation.goBack()} />
        </HeaderButtons>
      ),
      headerRight: () =>
        isGroupChat ? (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <Item
              title='Create'
              onPress={createPressHandler}
              disabled={isDisableCreateGroup}
              color={isDisableCreateGroup ? Colors.lightGrey : undefined}
            />
          </HeaderButtons>
        ) : undefined,
    });
  }, [isGroupChat, isDisableCreateGroup, groupName, selectedUsers]);

  const userSelectedHandler = useCallback(
    (user) => {
      if (isGroupChat) {
        setSelectedUsers((oldSeletedUserIds) => {
          let result = oldSeletedUserIds.filter(
            (u) => u.userId !== user.userId
          );
          if (result.length === oldSeletedUserIds.length) {
            result.push(user);
          }
          return result;
        });
      } else {
        const foundChat = Object.values(chatsData).find((c) =>
          c.users.includes(user.userId)
        );
        navigation.navigate(Screens.Chat, {
          selectedUsersId: [user.userId, userData.userId],
          chatId: foundChat?.chatId,
        });
      }
    },
    [chatsData, isGroupChat, selectedUsers]
  );

  return (
    <PageContainer ignoreTop isView>
      {isGroupChat && (
        <View style={styles.groupNameContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textbox}
              placeholder='Enter your group name'
              autoCorrect={false}
              autoComplete={undefined}
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
            />
          </View>
        </View>
      )}

      {isGroupChat && (
        <View style={styles.selectedUsersContainer}>
          <FlatList
            style={styles.selectedUsersList}
            data={selectedUsers}
            horizontal={true}
            keyExtractor={(user) => user.userId}
            renderItem={({ item: user }) => {
              return (
                <ProfileImage
                  image={user.imageUri}
                  size={40}
                  onPress={() => userSelectedHandler(user)}
                  showRemoveIcon={true}
                  style={styles.selectedUserItem}
                />
              );
            }}
            ref={flatListRef}
            onContentSizeChange={() =>
              flatListRef.current.scrollToEnd({ animated: false })
            }
          />
        </View>
      )}

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
        onUserSelected={userSelectedHandler}
        isGroupChat={isGroupChat}
        selectedUsers={selectedUsers}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  selectedUsersContainer: {
    height: 50,
    justifyContent: 'center',
  },
  selectedUsersList: {
    height: '100%',
    paddingTop: 5,
    paddingBottom: 5,
  },
  selectedUserItem: {
    marginRight: 10,
  },
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
  groupNameContainer: {
    paddingVertical: 5,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: Colors.nearlyWhite,
    flexDirection: 'row',
    borderRadius: 2,
  },
  textbox: {
    color: Colors.textColor,
    width: '100%',
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});
