import { useCallback, useLayoutEffect, useState } from 'react';
import { ImageBackground, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Bubble from '../components/Chat/Bubble';
import IconButton from '../components/UI/IconButton';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import { createChat } from '../firebase/chat';
import { Colors } from '../utils/constants';

export default function ChatScreen({ navigation, route }) {
  const { selectedUser, chatId: chatIdInput } = route.params;
  const userData = useSelector((state) => state.auth.userData);

  const [messageText, setMessageText] = useState('');
  const [chatId, setChatId] = useState(chatIdInput);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${selectedUser.firstName} ${selectedUser.lastName}`,
    });
  }, [navigation, selectedUser]);

  function imageButtonHandler() {
    console.log('image clicked');
  }

  const sendMessageHandler = useCallback(async () => {
    if (!chatId) {
      // no chat id, create new chat
      const newChatId = await createChat(userData.userId, {
        users: [userData.userId, selectedUser.userId],
      });
      setChatId(newChatId);
    }
    setMessageText('');
  }, [chatId, messageText]);

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={styles.flex1}>
      <MyKeyboardAvoidingView>
        <ImageBackground
          source={require('../assets/images/droplet.jpeg')}
          style={styles.flex1}
        >
          {!chatId && (
            <Bubble text='This is a new chat. Say hi!' type='system' />
          )}
        </ImageBackground>

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
      </MyKeyboardAvoidingView>
    </SafeAreaView>
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
