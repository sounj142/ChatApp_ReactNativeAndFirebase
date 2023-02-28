import app from './config';
import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import { setChatIds, setChatsData } from '../store/chatsSlice';
import { setStoredUsers } from '../store/usersSlice';
import { store } from '../store/store';
import { setMessagesData, setStarredMessages } from '../store/messagesSlice';

export async function createChat(loggedInUserId, { users }) {
  const newChatData = {
    users,
    createdBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedBy: loggedInUserId,
    updatedAt: new Date().toISOString(),
  };
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, 'chats');
  const newChat = await push(chatRef, newChatData);

  for (const userId of users) {
    const userChatRef = child(dbRef, `userChats/${userId}`);
    await push(userChatRef, newChat.key);
  }
  return newChat.key;
}

export function subscribeToUserChats(userId) {
  const dbRef = ref(getDatabase(app));
  const userChatRef = child(dbRef, `userChats/${userId}`);

  return onValue(userChatRef, (querySnapshot) => {
    const chatIds = Object.values(querySnapshot.val() || {});
    store.dispatch(setChatIds(chatIds));
  });
}

export function subscribeToChat(chatId) {
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `chats/${chatId}`);

  return onValue(chatRef, (chatSnapshot) => {
    const chatData = chatSnapshot.val();
    chatData.chatId = chatSnapshot.key;
    store.dispatch(setChatsData(chatData));

    // get users data
    chatData.users.forEach(async (userId) => {
      const storedUsers = store.getState().users.storedUsers;
      if (storedUsers[userId]) return;

      const userRef = child(dbRef, `users/${userId}`);
      const userSnapshot = await get(userRef);
      const user = userSnapshot.val();
      store.dispatch(setStoredUsers({ [userId]: user }));
    });
  });
}

export function subscribeToMessage(chatId) {
  const dbRef = ref(getDatabase(app));
  const messageRef = child(dbRef, `messages/${chatId}`);

  return onValue(messageRef, (messageSnapshot) => {
    const messageData = messageSnapshot.val();
    store.dispatch(setMessagesData({ chatId, messageData }));
  });
}

export async function sendTextMessage(chatId, senderId, text) {
  const dbRef = ref(getDatabase(app));
  const messageRef = child(dbRef, `messages/${chatId}`);

  const messageData = {
    sentBy: senderId,
    sentAt: new Date().toISOString(),
    text: text,
  };
  await push(messageRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    lastestMessageText: text,
  });
}

export async function toggleStarMessage(userId, chatId, messageId) {
  const dbRef = ref(getDatabase(app));
  const starRef = child(
    dbRef,
    `userStarredMessages/${userId}/${chatId}/${messageId}`
  );

  const starSnapshot = await get(starRef);
  if (starSnapshot.exists()) {
    await remove(starRef);
  } else {
    const starData = {
      chatId,
      messageId,
      starredAt: new Date().toISOString(),
    };
    await set(starRef, starData);
  }
}

export function subscribeToStarredMessages(userId) {
  const dbRef = ref(getDatabase(app));
  const starRef = child(dbRef, `userStarredMessages/${userId}`);

  return onValue(starRef, (querySnapshot) => {
    const starredMessages = querySnapshot.val() || {};
    store.dispatch(setStarredMessages(starredMessages));
  });
}
