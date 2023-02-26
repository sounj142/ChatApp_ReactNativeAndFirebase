import app from './config';
import { child, getDatabase, push, ref } from 'firebase/database';

export async function createChat(loggedInUserId, { users }) {
  const newChatData = {
    users,
    createdBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: null,
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
