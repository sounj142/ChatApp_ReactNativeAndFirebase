import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import chatsSlice from './chatsSlice';
import messagesSlice from './messagesSlice';
import usersSlice from './usersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chats: chatsSlice,
    users: usersSlice,
    messages: messagesSlice,
  },
});
