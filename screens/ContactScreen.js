import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PageContainer from '../components/UI/PageContainer';
import ProfileImage from '../components/UI/ProfileImage';
import PageTitle from '../components/UI/PageTitle';
import { Colors, Screens } from '../utils/constants';
import { getUserChats, removeUserFromChatGroup } from '../firebase/chat';
import DataItem from '../components/UI/DataItem';
import groupDefaultImage from '../assets/images/group.jpg';
import MyButton from '../components/UI/MyButton';

export default function ContactScreen({ navigation, route }) {
  const { userId, selectedChatId } = route.params;
  const user = useSelector((state) => state.users.storedUsers[userId]);
  const chatsData = useSelector((state) => state.chats.chatsData);
  const userData = useSelector((state) => state.auth.userData);
  const selectedGroup = chatsData[selectedChatId];
  const [commonChats, setCommonChats] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);

  async function removeFromGroupProcess() {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await removeUserFromChatGroup(selectedGroup, userData, user);
      navigation.goBack();
    } finally {
      setIsRemoving(false);
    }
  }

  function removeFromGroupHandler() {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to remove user [${user.fullName}] from this group?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: removeFromGroupProcess },
      ]
    );
  }

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

      {selectedGroup && (
        <MyButton
          onPress={removeFromGroupHandler}
          isLoading={isRemoving}
          disabled={isRemoving}
          style={styles.removeFromGroupButton}
          loadingColor='white'
        >
          Remove from group "{selectedGroup.groupName}"
        </MyButton>
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
  removeFromGroupButton: {
    backgroundColor: Colors.red,
    marginTop: 10,
  },
});
