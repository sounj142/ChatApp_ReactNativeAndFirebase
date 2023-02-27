import { createSlice } from '@reduxjs/toolkit';

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
          state.storedUsers[user.userId] = user;
        });
      } else {
        Object.values(users).forEach((user) => {
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
export const setStoredUsers = usersSlice.actions.setStoredUsers;
export const clearAllUsersState = usersSlice.actions.clearAllUsersState;
