import { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '../../utils/constants';
import IconButton from '../UI/IconButton';

export default function ChatInput({ onSendMessage }) {
  const [messageText, setMessageText] = useState('');

  function imageButtonHandler() {
    console.log('image clicked');
  }

  const sendMessageHandler = useCallback(async () => {
    await onSendMessage(messageText);
    setMessageText('');
  }, [messageText]);

  return (
    <View style={styles.inputContainer}>
      <IconButton
        name='add'
        size={28}
        color={Colors.blue}
        onPress={imageButtonHandler}
        style={styles.mediaButton}
      />

      <TextInput
        style={styles.textInput}
        value={messageText}
        onChangeText={(text) => setMessageText(text)}
        onSubmitEditing={sendMessageHandler}
      />

      {!messageText && (
        <IconButton
          name='ios-camera-outline'
          size={28}
          color={Colors.blue}
          onPress={imageButtonHandler}
          style={styles.mediaButton}
        />
      )}

      {messageText && (
        <IconButton
          name='paper-plane-outline'
          size={24}
          color='white'
          onPress={sendMessageHandler}
          style={[styles.mediaButton, styles.sendButton]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    // height: 50,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Colors.lightGrey,
    marginHorizontal: 12,
    paddingHorizontal: 12,
  },
  mediaButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: Colors.blue,
    borderRadius: 50,
    paddingLeft: 8,
    paddingRight: 10,
  },
});
