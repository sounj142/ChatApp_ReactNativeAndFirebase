import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FlatList, ImageBackground, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Bubble from '../components/Chat/Bubble';
import ChatInput from '../components/Chat/ChatInput';
import ReplyTo from '../components/Chat/ReplyTo';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import {
  createChat,
  sendImageMessage,
  sendTextMessage,
} from '../firebase/chat';
import { uploadChatImageAsync } from '../firebase/storage';
import { commonStyles } from '../utils/styles';

let errorBannerTimerId;

export default function ChatScreen({ navigation, route }) {
  const { selectedUser, chatId: inputChatId } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const chatsData = useSelector((state) => state.chats.chatsData);
  const [chatId, setChatId] = useState(inputChatId || null);
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] || {}
  );
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const [errorBannerText, setErrorBannerText] = useState('');

  const flatListRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const chatMessagesDict = useSelector(
    (state) => state.messages.messagesData[chatId]
  );
  const chatMessages = useSelector((state) => {
    const messages = state.messages.messagesData[chatId];
    if (!messages) return [];
    return Object.values(messages).sort((x, y) =>
      x.sentAt.localeCompare(y.sentAt)
    );
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: selectedUser.fullName,
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

  async function getOrCreateChatChannel() {
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
    return currentChatId;
  }

  const sendMessageHandler = useCallback(
    async (messageText) => {
      try {
        const currentChatId = await getOrCreateChatChannel();
        await sendTextMessage(
          currentChatId,
          userData.userId,
          messageText,
          replyingTo?.key
        );

        setReplyingTo(null);
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
    [chatId, chatsData, selectedUser.userId, replyingTo]
  );

  const uploadPhotoConfirmHandler = async (tempImageUri) => {
    try {
      const currentChatId = await getOrCreateChatChannel();
      const uploadedUrl = await uploadChatImageAsync(
        tempImageUri,
        currentChatId
      );
      await sendImageMessage(
        currentChatId,
        userData.userId,
        uploadedUrl,
        replyingTo?.key
      );

      setReplyingTo(null);
      return true;
    } catch (error) {
      console.log('Error occurred when sending image message', error);
      return false;
    }
  };

  return (
    <SafeAreaView
      edges={['right', 'left', 'bottom']}
      style={commonStyles.flex1}
    >
      <MyKeyboardAvoidingView>
        <ImageBackground
          source={require('../assets/images/droplet.jpeg')}
          style={commonStyles.flex1}
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
                const isStarred = starredMessages[message.key];
                const replyToMessage = chatMessagesDict[message.replyTo];
                const replyToUser = storedUsers[replyToMessage?.sentBy];
                return (
                  <Bubble
                    text={message.text}
                    imageUri={message.imageUri}
                    type={isOwn ? 'myMessage' : 'theirMessage'}
                    userId={userData.userId}
                    chatId={chatId}
                    messageId={message.key}
                    isStarred={isStarred}
                    sentAt={message.sentAt}
                    setReply={() => setReplyingTo(message)}
                    replyToMessage={replyToMessage}
                    replyToUser={replyToUser}
                  />
                );
              }}
              ref={flatListRef}
              onContentSizeChange={() =>
                flatListRef.current.scrollToEnd({ animated: false })
              }
              onLayout={() =>
                flatListRef.current.scrollToEnd({ animated: false })
              }
            />
          )}

          {replyingTo && (
            <ReplyTo
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => setReplyingTo(null)}
            />
          )}
        </ImageBackground>

        <ChatInput
          onSendMessage={sendMessageHandler}
          onUploadImage={uploadPhotoConfirmHandler}
        />
      </MyKeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
