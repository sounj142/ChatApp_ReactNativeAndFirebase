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
import { Colors } from '../utils/constants';
import { searchUsers } from '../firebase/user';
import ChatListContent from '../components/ChatList/ChatListContent';
import { useDispatch, useSelector } from 'react-redux';
import { setStoredUsers } from '../store/usersSlice';
import ProfileImage from '../components/UI/ProfileImage';
import { addUsersToGroup } from '../firebase/chat';

export default function AddUsersToGroupScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { chatId } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const chatGroup = useSelector((state) => state.chats.chatsData[chatId]);

  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToGroup, setIsAddingToGroup] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const isDisableAddBtn = !selectedUsers.length;
  const flatListRef = useRef(null);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchText) {
        setUsers(null);
        return;
      }
      setIsLoading(true);
      try {
        let usersResult = await searchUsers(searchText);
        dispatch(setStoredUsers({ ...usersResult }));

        if (usersResult) {
          // remove current user from search result
          delete usersResult[userData.userId];
          // remove all users that have already been members of group
          chatGroup.users.forEach((uid) => {
            delete usersResult[uid];
          });

          if (!Object.keys(usersResult).length) usersResult = null;
        }

        setUsers(usersResult);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchText, chatGroup]);

  const addPressHandler = useCallback(async () => {
    if (isAddingToGroup) return;
    setIsAddingToGroup(true);
    try {
      await addUsersToGroup(chatGroup, userData, selectedUsers);
      navigation.goBack();
    } finally {
      setIsAddingToGroup(true);
    }
  }, [chatGroup, selectedUsers, isAddingToGroup]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Add to Group [${chatGroup.groupName}]`,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title='Add'
            onPress={addPressHandler}
            disabled={isDisableAddBtn || isAddingToGroup}
            color={isDisableAddBtn ? Colors.lightGrey : undefined}
          />
        </HeaderButtons>
      ),
    });
  }, [isDisableAddBtn, selectedUsers, chatGroup]);

  const userSelectedHandler = useCallback(
    (user) => {
      setSelectedUsers((oldSeletedUserIds) => {
        let result = oldSeletedUserIds.filter((u) => u.userId !== user.userId);
        if (result.length === oldSeletedUserIds.length) {
          result.push(user);
        }
        return result;
      });
    },
    [selectedUsers]
  );

  return (
    <PageContainer ignoreTop isView>
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
        isGroupChat={true}
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
});
