import { useCallback, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import IconButton from '../components/UI/IconButton';
import { Colors } from '../utils/constants';
import { IS_IOS } from '../utils/system';

export default function ChatScreen({ navigation }) {
  const [messageText, setMessageText] = useState('');

  function imageButtonHandler() {
    console.log('image clicked');
  }

  const sendMessageHandler = useCallback(() => {
    console.log('send message clicked', messageText);
    setMessageText('');
  }, [messageText]);

  return (
    <View style={styles.flex1}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={IS_IOS ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          source={require('../assets/images/droplet.jpeg')}
          style={styles.flex1}
        />

        <View style={styles.inputContainer}>
          <IconButton
            name='add'
            size={28}
            color={Colors.blue500}
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
              color={Colors.blue500}
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
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
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
    backgroundColor: Colors.blue500,
    borderRadius: 50,
    paddingLeft: 8,
    paddingRight: 10,
  },
});
