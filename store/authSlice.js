import { createSlice } from '@reduxjs/toolkit';
import { getFullName } from '../utils/helper';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userData: null,
  },
  reducers: {
    authenticate: (state, action) => {
      const { userData } = action.payload;
      userData.fullName = getFullName(userData);
      state.userData = userData;
    },
    logOut: (state) => {
      state.userData = null;
    },
  },
});

export default authSlice.reducer;
export const { authenticate, logOut } = authSlice.actions;
