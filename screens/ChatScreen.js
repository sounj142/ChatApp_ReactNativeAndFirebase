import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Bubble from '../components/Chat/Bubble';
import ChatInput from '../components/Chat/ChatInput';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import { createChat, sendTextMessage } from '../firebase/chat';

let errorBannerTimerId;

export default function ChatScreen({ navigation, route }) {
  const { selectedUser, chatId: inputChatId } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const chatsData = useSelector((state) => state.chats.chatsData);
  const [chatId, setChatId] = useState(inputChatId || null);
  const [errorBannerText, setErrorBannerText] = useState('');

  const chatMessages = useSelector((state) => {
    const messages = state.messages.messagesData[chatId];
    if (!messages) return [];
    return Object.values(messages).sort((x, y) =>
      x.sentAt.localeCompare(y.sentAt)
    );
  });

  console.log(chatMessages);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${selectedUser.firstName} ${selectedUser.lastName}`,
    });
  }, [navigation, selectedUser]);

  // clear errorBannerTimerId
  useEffect(() => {
    return () => {
      if (errorBannerTimerId) {
        clearTimeout(errorBannerTimerId);
        errorBannerTimerId = undefined;
      }
    };
  }, []);

  const sendMessageHandler = useCallback(
    async (messageText) => {
      try {
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

        await sendTextMessage(currentChatId, userData.userId, messageText);
        return true;
      } catch (error) {
        console.log('Error occurred when sending message', error);
        setErrorBannerText('Message failed to send.');

        // clear error message after 5s
        if (errorBannerTimerId) clearTimeout(errorBannerTimerId);
        errorBannerTimerId = setTimeout(() => {
          setErrorBannerText('');
          errorBannerTimerId = undefined;
        }, 5000);
        return false;
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
          {errorBannerText && <Bubble text={errorBannerText} type='error' />}

          {chatId && (
            <FlatList
              data={chatMessages}
              keyExtractor={(item) => item.key}
              renderItem={({ item: message }) => {
                const isOwn = message.sentBy === userData.userId;
                return (
                  <Bubble
                    text={`${message.text}`}
                    type={isOwn ? 'myMessage' : 'theirMessage'}
                  />
                );
              }}
            />
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
