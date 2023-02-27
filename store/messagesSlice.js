import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messagesData: {},
  },
  reducers: {
    setMessagesData: (state, action) => {
      const { chatId, messageData } = action.payload;
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
