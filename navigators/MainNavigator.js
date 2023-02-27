import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToChat, subscribeToUserChats } from '../firebase/chat';
import { observeUserChange } from '../firebase/user';
import StartUpScreen from '../screens/StartUpScreen';
import { clearAllChatsState } from '../store/chatsSlice';
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
      Object.values(chatUnsubscribes).forEach((callback) => callback());
      chatUnsubscribes = {};
    };
  }, []);

  useEffect(() => {
    if (!chatIds.length) return;

    console.log('Subscribing to chat chanels...');
    // add new chat chanels
    for (const newChatId of chatIds) {
      if (!chatUnsubscribes[newChatId]) {
        const unsubscribe = subscribeToChat(newChatId);
        chatUnsubscribes[newChatId] = unsubscribe;
      }
    }
  }, [chatIds]);

  // clear all chats data when user logout
  useEffect(() => {
    return () => {
      dispatch(clearAllChatsState());
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
