import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    storedUsers: {},
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const users = action.payload;
      Object.values(users).forEach((user) => {
        state.storedUsers[user.userId] = user;
      });
    },
  },
});

export default usersSlice.reducer;
export const setStoredUsers = usersSlice.actions.setStoredUsers;
