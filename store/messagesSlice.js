import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesData: {},
  },
  reducers: {
    setMessagesData: (state, action) => {
      let { chatId, messageData } = action.payload;
      messageData = messageData || {};
      Object.entries(messageData).forEach(([key, value]) => (value.key = key));
      state.messagesData[chatId] = messageData;
    },
    clearAllMessagesState: (state) => {
      state.messagesData = {};
    },
  },
});

export default messagesSlice.reducer;
export const setMessagesData = messagesSlice.actions.setMessagesData;
export const clearAllMessagesState =
  messagesSlice.actions.clearAllMessagesState;
