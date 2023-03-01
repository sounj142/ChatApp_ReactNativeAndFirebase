import { createSlice } from '@reduxjs/toolkit';
import { getFullName } from '../utils/helper';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    storedUsers: {},
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const users = action.payload;
      if (Array.isArray(users)) {
        users.forEach((user) => {
          user.fullName = getFullName(user);
          state.storedUsers[user.userId] = user;
        });
      } else {
        Object.values(users).forEach((user) => {
          user.fullName = getFullName(user);
          state.storedUsers[user.userId] = user;
        });
      }
    },
    clearAllUsersState: (state) => {
      state.storedUsers = {};
    },
  },
});

export default usersSlice.reducer;
export const { setStoredUsers, clearAllUsersState } = usersSlice.actions;
