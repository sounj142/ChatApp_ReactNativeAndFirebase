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

export async function createChat(loggedInUserId, { users, groupName }) {
  const newChatData = {
    users,
    createdBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedBy: loggedInUserId,
    updatedAt: new Date().toISOString(),
    groupName: groupName || null,
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

export function sendTextMessage(chatId, senderId, text, replyTo) {
  return sendMessage(chatId, senderId, text, null, replyTo);
}

export function sendImageMessage(chatId, senderId, imageUri, replyTo) {
  return sendMessage(chatId, senderId, 'Image', imageUri, replyTo);
}

export async function sendMessage(chatId, senderId, text, imageUri, replyTo) {
  const dbRef = ref(getDatabase(app));
  const messageRef = child(dbRef, `messages/${chatId}`);

  const messageData = {
    sentBy: senderId,
    sentAt: new Date().toISOString(),
    text: text ?? null,
    imageUri: imageUri ?? null,
    replyTo: replyTo ?? null,
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

export async function getUserChats(userId) {
  const dbRef = ref(getDatabase(app));
  const userChatRef = child(dbRef, `userChats/${userId}`);
  const snapshot = await get(userChatRef);
  return snapshot.val();
}
