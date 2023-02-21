import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userData: null,
  },
  reducers: {
    authenticate: (state, action) => {
      const { userData } = action.payload;
      state.userData = userData;
    },
    logOut: (state) => {
      state.userData = null;
    },
  },
});

export default authSlice.reducer;
export const authenticate = authSlice.actions.authenticate;
export const logOut = authSlice.actions.logOut;
