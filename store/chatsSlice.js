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
      const newChatsData = {};
      for (const chatId of state.chatIds) {
        if (state.chatsData[chatId])
          newChatsData[chatId] = state.chatsData[chatId];
      }
      state.chatsData = newChatsData;
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
export const { setChatIds, setChatsData, clearAllChatsState } =
  chatsSlice.actions;
