import { createSlice } from '@reduxjs/toolkit';

const chatsSlice = createSlice({
  name: 'chats',
  initialState: {
    chatIds: [],
    chatsData: {},
    isFirstLoading: true,
  },
  reducers: {
    setChatIds: (state, action) => {
      state.chatIds = action.payload;
      if (state.isFirstLoading && !state.chatIds.length) {
        state.isFirstLoading = false;
      }
    },
    setChatsData: (state, action) => {
      const chatData = action.payload;
      state.chatsData[chatData.chatId] = chatData;
      if (
        state.isFirstLoading &&
        state.chatIds.length === Object.keys(state.chatsData).length
      ) {
        state.isFirstLoading = false;
      }
    },
    clearAllChatsState: (state) => {
      state.chatIds = [];
      state.chatsData = {};
      state.isFirstLoading = true;
    },
  },
});

export default chatsSlice.reducer;
export const setChatIds = chatsSlice.actions.setChatIds;
export const setChatsData = chatsSlice.actions.setChatsData;
export const clearAllChatsState = chatsSlice.actions.clearAllChatsState;
