import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import usersSlice from './usersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: usersSlice,
  },
});
