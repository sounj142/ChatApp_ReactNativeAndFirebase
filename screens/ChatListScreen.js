import { FlatList } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { Screens } from '../utils/constants';
import IoniconsHeaderButton from '../components/UI/IoniconsHeaderButton';
import DataItem from '../components/UI/DataItem';
import PageContainer from '../components/UI/PageContainer';
import ChatListHeader from '../components/ChatList/ChatListHeader';

export default function ChatListScreen({ navigation }) {
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userChats = useSelector((state) =>
    Object.values(state.chats.chatsData).sort((x, y) =>
      y.updatedAt.localeCompare(x.updatedAt)
    )
  );

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
    <PageContainer ignoreTop isView>
      <ChatListHeader navigation={navigation} />

      <FlatList
        data={userChats}
        keyExtractor={(item) => item.chatId}
        renderItem={({ item: chatData }) => {
          const userId = chatData.users.find((uid) => uid !== userData.userId);
          const user = storedUsers[userId];

          if (!user) return;
          return (
            <DataItem
              title={user.fullName}
              subTitle={chatData.lastestMessageText}
              imageUri={user.imageUri}
              onPress={() =>
                navigation.navigate(Screens.Chat, {
                  selectedUserId: user.userId,
                  chatId: chatData.chatId,
                })
              }
            />
          );
        }}
      />
    </PageContainer>
  );
}
