import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PageContainer from '../components/UI/PageContainer';
import ProfileImage from '../components/UI/ProfileImage';
import PageTitle from '../components/UI/PageTitle';
import { Colors, Screens } from '../utils/constants';
import { getUserChats } from '../firebase/chat';
import DataItem from '../components/UI/DataItem';
import groupDefaultImage from '../assets/images/group.jpg';

export default function ContactScreen({ navigation, route }) {
  const { userId } = route.params;
  const user = useSelector((state) => state.users.storedUsers[userId]);
  const chatsData = useSelector((state) => state.chats.chatsData);
  const [commonChats, setCommonChats] = useState([]);

  useEffect(() => {
    (async () => {
      const userChats = await getUserChats(user.userId);
      const chatIds = Object.values(userChats);
      const chatList = [];
      Object.values(chatsData).forEach((chatItem) => {
        if (chatItem.groupName && chatIds.includes(chatItem.chatId)) {
          chatList.push(chatItem);
        }
      });
      setCommonChats(chatList);
    })();
  }, [user, setCommonChats]);

  return (
    <PageContainer ignoreTop>
      <View style={styles.container}>
        <ProfileImage image={user.imageUri} size={100} style={styles.image} />

        <PageTitle title={user.fullName} />

        {user.about && (
          <Text numberOfLines={2} style={styles.about}>
            {user.about}
          </Text>
        )}
      </View>

      {!!commonChats.length && (
        <View>
          <Text style={styles.heading}>
            {commonChats.length} {commonChats.length === 1 ? 'Group' : 'Groups'}{' '}
            in Common
          </Text>

          {commonChats.map((chat) => (
            <DataItem
              key={chat.chatId}
              title={chat.groupName}
              subTitle={chat.lastestMessageText}
              imageUri={chat.imageUri}
              defaultImage={groupDefaultImage}
              icon='chevron-forward-outline'
              onPress={() => {
                navigation.push(Screens.Chat, { chatId: chat.chatId });
              }}
            />
          ))}
        </View>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  image: {
    marginBottom: 20,
  },
  about: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
    color: Colors.grey,
  },
  heading: {
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: Colors.textColor,
    marginVertical: 8,
  },
});
