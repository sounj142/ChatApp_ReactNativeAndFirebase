import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesData: {},
    starredMessages: {},
  },
  reducers: {
    setMessagesData: (state, action) => {
      let { chatId, messageData } = action.payload;
      messageData = messageData || {};
      Object.entries(messageData).forEach(([key, value]) => (value.key = key));
      state.messagesData[chatId] = messageData;
    },
    setStarredMessages(state, action) {
      state.starredMessages = action.payload;
    },
    clearAllMessagesState: (state) => {
      state.messagesData = {};
      state.starredMessages = {};
    },
  },
});

export default messagesSlice.reducer;
export const { setMessagesData, setStarredMessages, clearAllMessagesState } =
  messagesSlice.actions;
