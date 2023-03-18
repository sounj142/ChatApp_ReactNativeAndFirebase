import app from './config';
import {
  child,
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
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
    createdAt: serverTimestamp(),
    updatedBy: loggedInUserId,
    updatedAt: serverTimestamp(),
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

export async function updateChat(
  chatId,
  loggedInUserId,
  imageUri = undefined,
  groupName = undefined
) {
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `chats/${chatId}`);

  const updateData = {
    updatedBy: loggedInUserId,
    updatedAt: serverTimestamp(),
  };
  if (imageUri) updateData.imageUri = imageUri;
  if (groupName) updateData.groupName = groupName;

  await update(chatRef, updateData);
}

export async function leaveChatGroup(chatData, loggedInUser) {
  if (!chatData || !chatData.users.includes(loggedInUser.userId)) return;

  await _removeUserFromChatGroup(chatData, loggedInUser, loggedInUser);
}

export async function removeUserFromChatGroup(
  chatData,
  loggedInUser,
  userToRemove
) {
  if (chatData.createdBy !== loggedInUser.userId)
    throw new Error('Only group owner can remove other user');
  if (!chatData || !chatData.users.includes(userToRemove.userId)) return;

  await _removeUserFromChatGroup(chatData, loggedInUser, userToRemove);
}

async function _removeUserFromChatGroup(chatData, loggedInUser, userToRemove) {
  const loggedInUserId = loggedInUser.userId;
  const userToRemoveId = userToRemove.userId;

  // remove userId from group
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `chats/${chatData.chatId}`);
  const users = chatData.users.filter((uid) => uid !== userToRemoveId);
  let deletedGroup = false;
  if (users.length) {
    const newChatData = {
      users: users,
      updatedBy: loggedInUserId,
      updatedAt: serverTimestamp(),
    };
    // if owner leave group, assign oner role to the first user.
    if (chatData.createdBy === userToRemoveId) {
      newChatData.createdBy = users[0];
    }
    await update(chatRef, newChatData);
  } else {
    // no users in group. Delete it.
    await remove(chatRef);
    deletedGroup = true;
  }

  // for removed user, remove chatId from his chat list
  const userChatRef = child(dbRef, `userChats/${userToRemoveId}`);
  const snapshot = await get(userChatRef);
  const userChats = snapshot.val() || {};
  for (const key in userChats) {
    if (userChats[key] === chatData.chatId) {
      const chatToRemoveRef = child(
        dbRef,
        `userChats/${userToRemoveId}/${key}`
      );
      await remove(chatToRemoveRef);
      break;
    }
  }

  if (!deletedGroup) {
    // send info message
    const message =
      loggedInUserId === userToRemoveId
        ? `${loggedInUser.fullName} leaved group`
        : `${loggedInUser.fullName} removed ${userToRemove.fullName} from group`;
    await sendInfoMessage(chatData.chatId, loggedInUserId, message);
  }
}

export async function addUsersToGroup(chatData, loggedInUser, usersToAdd) {
  const loggedInUserId = loggedInUser.userId;
  usersToAdd = usersToAdd.filter((u) => !chatData.users.includes(u.userId));
  if (!usersToAdd.length) return;

  // add users to group
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `chats/${chatData.chatId}`);
  const users = [...chatData.users, ...usersToAdd.map((u) => u.userId)];
  const newChatData = {
    users: users,
    updatedBy: loggedInUserId,
    updatedAt: serverTimestamp(),
  };
  await update(chatRef, newChatData);

  // add mapping users <-> chatgroup
  for (const user of usersToAdd) {
    const userChatRef = child(dbRef, `userChats/${user.userId}`);
    await push(userChatRef, chatData.chatId);
  }

  // send info message
  const userAddedNames = usersToAdd.map((u) => u.fullName).join(', ');
  const message = `${loggedInUser.fullName} added ${userAddedNames} to group`;
  await sendInfoMessage(chatData.chatId, loggedInUserId, message);
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
    if (!chatData) return;
    chatData.chatId = chatSnapshot.key;
    store.dispatch(setChatsData(chatData));

    // get users data
    chatData.users &&
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
  return sendMessage(chatId, senderId, text, null, replyTo, null);
}

export function sendInfoMessage(chatId, senderId, text) {
  return sendMessage(chatId, senderId, text, null, null, 'info');
}

export function sendImageMessage(chatId, senderId, imageUri, replyTo) {
  return sendMessage(chatId, senderId, 'Image', imageUri, replyTo, null);
}

export async function sendMessage(
  chatId,
  senderId,
  text,
  imageUri,
  replyTo,
  type
) {
  const dbRef = ref(getDatabase(app));
  const messageRef = child(dbRef, `messages/${chatId}`);

  const messageData = {
    sentBy: senderId,
    sentAt: serverTimestamp(),
    text: text ?? null,
    imageUri: imageUri ?? null,
    replyTo: replyTo ?? null,
    type: type ?? null,
  };
  await push(messageRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: serverTimestamp(),
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
      starredAt: serverTimestamp(),
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

async function sendPushNotification(
  expoPushToken,
  title,
  body,
  data = undefined
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
  };

  if (data) message['data'] = data;

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export function sendPushNotificationForUsers(
  userIds,
  title,
  body,
  data = undefined
) {
  const dbRef = ref(getDatabase(app));

  userIds.forEach(async (uid) => {
    const tokensRef = child(dbRef, `users/${uid}/pushTokens`);

    const snapshot = await get(tokensRef);
    const pushTokens = snapshot.val();

    if (pushTokens) {
      Object.values(pushTokens).forEach((token) => {
        try {
          sendPushNotification(token, title, body, data);
        } catch (error) {
          console.log('Error when sending push notification', error);
        }
      });
    }
  });
}
