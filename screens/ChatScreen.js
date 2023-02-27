import { useCallback, useLayoutEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Bubble from '../components/Chat/Bubble';
import ChatInput from '../components/Chat/ChatInput';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import { createChat } from '../firebase/chat';

export default function ChatScreen({ navigation, route }) {
  const { selectedUser, chatId: inputChatId } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const chatsData = useSelector((state) => state.chats.chatsData);
  const [chatId, setChatId] = useState(inputChatId || null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${selectedUser.firstName} ${selectedUser.lastName}`,
    });
  }, [navigation, selectedUser]);

  const sendMessageHandler = useCallback(
    async (messageText) => {
      let currentChatId = chatId;
      if (!currentChatId) {
        // find chatId
        const foundChat = Object.values(chatsData).find((c) =>
          c.users.includes(selectedUser.userId)
        );
        if (foundChat) {
          currentChatId = foundChat.chatId;
          setChatId(currentChatId);
        }
      }
      if (!currentChatId) {
        // no chat id, create a new chat
        currentChatId = await createChat(userData.userId, {
          users: [userData.userId, selectedUser.userId],
        });
        setChatId(currentChatId);
      }
    },
    [chatId, chatsData, selectedUser.userId]
  );

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.flex1}>
      <MyKeyboardAvoidingView>
        <ImageBackground
          source={require('../assets/images/droplet.jpeg')}
          style={styles.flex1}
        >
          {!chatId && (
            <Bubble text='This is a new chat. Say hi!' type='system' />
          )}
        </ImageBackground>

        <ChatInput onSendMessage={sendMessageHandler} />
      </MyKeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
