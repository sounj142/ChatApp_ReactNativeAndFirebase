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
  },
});

export default authSlice.reducer;
export const authenticate = authSlice.actions.authenticate;
