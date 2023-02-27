import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  subscribeToChat,
  subscribeToMessage,
  subscribeToUserChats,
} from '../firebase/chat';
import { observeUserChange } from '../firebase/user';
import StartUpScreen from '../screens/StartUpScreen';
import { clearAllChatsState } from '../store/chatsSlice';
import { clearAllMessagesState } from '../store/messagesSlice';
import StackNavigator from './StackNavigator';

let chatUnsubscribes = {};

export default function MainNavigator() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const chatIds = useSelector((state) => state.chats.chatIds);
  const isFirstLoadingChats = useSelector(
    (state) => state.chats.isFirstLoading
  );

  useEffect(() => {
    console.log('Subscribing to firebase listeners...');
    const unsubscribeUserChats = subscribeToUserChats(userData.userId);
    return () => {
      console.log('Unsubscribing firebase listeners...');
      unsubscribeUserChats();
      Object.values(chatUnsubscribes).forEach(
        ({ chatUnsubscribe, messageUnsubscribe }) => {
          chatUnsubscribe();
          messageUnsubscribe();
        }
      );
      chatUnsubscribes = {};
    };
  }, []);

  useEffect(() => {
    if (!chatIds.length) return;

    console.log('Subscribing to chat chanels...');
    // add new subscribes to chat chanels
    for (const newChatId of chatIds) {
      if (!chatUnsubscribes[newChatId]) {
        const chatUnsubscribe = subscribeToChat(newChatId);
        const messageUnsubscribe = subscribeToMessage(newChatId);
        chatUnsubscribes[newChatId] = {
          chatUnsubscribe,
          messageUnsubscribe,
        };
      }
    }
  }, [chatIds]);

  // clear all chats data when user logout
  useEffect(() => {
    return () => {
      dispatch(clearAllChatsState());
      dispatch(clearAllMessagesState());
    };
  }, []);

  // watch all change on userData
  useEffect(() => {
    const unsubscribe = observeUserChange(userData.userId);
    return unsubscribe;
  }, []);

  if (isFirstLoadingChats) return <StartUpScreen />;

  return <StackNavigator />;
}
