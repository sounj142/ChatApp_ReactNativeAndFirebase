import app from './config';
import { child, get, getDatabase, onValue, push, ref } from 'firebase/database';
import { setChatIds, setChatsData } from '../store/chatsSlice';
import { setStoredUsers } from '../store/usersSlice';
import { store } from '../store/store';

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

export function subscribeToUserChats(userId, dispatch) {
  const dbRef = ref(getDatabase(app));
  const userChatRef = child(dbRef, `userChats/${userId}`);

  return onValue(userChatRef, (querySnapshot) => {
    const chatIds = Object.values(querySnapshot.val() || {});
    dispatch(setChatIds(chatIds));
  });
}

export function subscribeToChat(chatId, dispatch) {
  const dbRef = ref(getDatabase(app));
  const chatRef = child(dbRef, `chats/${chatId}`);

  return onValue(chatRef, (chatSnapshot) => {
    const chatData = chatSnapshot.val();
    chatData.chatId = chatSnapshot.key;
    dispatch(setChatsData(chatData));

    // get users data
    chatData.users.forEach(async (userId) => {
      const storedUsers = store.getState().users.storedUsers;
      if (storedUsers[userId]) return;

      const userRef = child(dbRef, `users/${userId}`);
      const userSnapshot = await get(userRef);
      const user = userSnapshot.val();
      dispatch(setStoredUsers({ [userId]: user }));
    });
  });
}
