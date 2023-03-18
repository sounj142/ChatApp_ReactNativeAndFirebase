import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PageContainer from '../components/UI/PageContainer';
import DataItem from '../components/UI/DataItem';
import { Colors, Screens } from '../utils/constants';
import { useLayoutEffect } from 'react';

export default function StarredMessagesScreen({ navigation, route }) {
  const { chatId } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const chatData = useSelector(
    (state) => state.chats.chatsData[chatId] || { users: [] }
  );

  const starredMessages = useSelector((state) => {
    const starredDict = state.messages.starredMessages[chatId] || {};
    const messages = state.messages.messagesData[chatId];
    if (!messages) return [];
    return Object.values(messages)
      .filter((message) => starredDict[message.key])
      .sort((x, y) => x.sentAt - y.sentAt);
  });

  useLayoutEffect(() => {
    let title;
    if (chatData.groupName) {
      title = `Group: ${chatData.groupName}`;
    } else {
      const otherUserId = chatData.users.find((uid) => userData.userId !== uid);
      const otherUser = storedUsers[otherUserId];
      title = `Chat to ${otherUser.fullName}`;
    }
    navigation.setOptions({
      headerTitle: title,
    });
  }, [navigation, chatData]);

  return (
    <PageContainer ignoreTop isView>
      <View style={styles.container}>
        <Text style={styles.heading}>
          {starredMessages.length}{' '}
          {starredMessages.length === 1
            ? 'Starred Message'
            : 'Starred Messages'}
        </Text>

        <FlatList
          data={starredMessages}
          keyExtractor={(message) => message.key}
          renderItem={({ item: message }) => {
            const user = storedUsers[message.sentBy];
            return (
              <DataItem
                key={message.key}
                title={user.fullName}
                subTitle={message.text}
                imageUri={user.imageUri}
                notPressable={true}
              />
            );
          }}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  heading: {
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: Colors.textColor,
    marginVertical: 8,
  },
});
