import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import {
  subscribeToChat,
  subscribeToMessage,
  subscribeToStarredMessages,
  subscribeToUserChats,
} from '../firebase/chat';
import { observeUserChange, storePushToken } from '../firebase/user';
import StartUpScreen from '../screens/StartUpScreen';
import { clearAllChatsState } from '../store/chatsSlice';
import { clearAllMessagesState } from '../store/messagesSlice';
import StackNavigator from './StackNavigator';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import { Screens } from '../utils/constants';
import { StackActions, useNavigation } from '@react-navigation/native';

let chatUnsubscribes = {};

export default function MainNavigator() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const chatIds = useSelector((state) => state.chats.chatIds);
  const isFirstLoadingChats = useSelector(
    (state) => state.chats.isFirstLoading
  );
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      storePushToken(userData, token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // handle received notification
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.chatId) {
          const pushAction = StackActions.push(Screens.Chat, {
            chatId: data.chatId,
          });
          navigation.dispatch(pushAction);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    console.log('Subscribing to firebase listeners...');
    // watch all chat ids of current user
    const unsubscribeUserChats = subscribeToUserChats(userData.userId);
    // watch all chat stars of current user
    const unsubscribeStarred = subscribeToStarredMessages(userData.userId);

    return () => {
      console.log('Unsubscribing firebase listeners...');
      unsubscribeUserChats();
      unsubscribeStarred();

      Object.values(chatUnsubscribes).forEach(
        ({ chatUnsubscribe, messageUnsubscribe }) => {
          chatUnsubscribe();
          messageUnsubscribe();
        }
      );
      chatUnsubscribes = {};
    };
  }, []);

  // watch all chat channels of current user
  useEffect(() => {
    // unsubscribe leaved groups
    Object.keys(chatUnsubscribes).forEach((key) => {
      if (!chatIds.includes(key)) {
        const { chatUnsubscribe, messageUnsubscribe } = chatUnsubscribes[key];
        chatUnsubscribe();
        messageUnsubscribe();
        delete chatUnsubscribes[key];
      }
    });

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
