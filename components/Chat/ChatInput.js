import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Colors } from '../../utils/constants';
import IconButton from '../UI/IconButton';
import {
  deleteTempImage,
  launchImagePicker,
  openCamera,
} from '../../utils/imagePickerHelper';

export default function ChatInput({ onSendMessage, onUploadImage }) {
  const [messageText, setMessageText] = useState('');
  const [tempImageUri, setTempImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadPhotoHandler = useCallback(async () => {
    const img = await launchImagePicker();
    if (!img) return;
    setTempImageUri(img);
  }, [setTempImageUri]);

  async function openCameraHandler() {
    const img = await openCamera();
    if (!img) return;
    setTempImageUri(img);
  }

  const uploadPhotoCancelHandler = useCallback(async () => {
    if (isLoading) return;
    await deleteTempImage(tempImageUri);
    setTempImageUri(null);
  }, [tempImageUri, isLoading]);

  const uploadPhotoConfirmHandler = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    const succeed = await onUploadImage(tempImageUri);
    if (succeed) {
      await deleteTempImage(tempImageUri);
      // due to a weid behavior in AwesomeAlert, the order of two commands bellow are important =.=
      setIsLoading(false);
      setTempImageUri(null);
    } else {
      setIsLoading(false);
    }
  }, [tempImageUri, onUploadImage, isLoading, setIsLoading, setTempImageUri]);

  const sendMessageHandler = useCallback(async () => {
    const succeed = await onSendMessage(messageText);
    if (succeed) setMessageText('');
  }, [messageText, onSendMessage]);

  return (
    <View style={styles.inputContainer}>
      <IconButton
        name='add'
        size={28}
        color={Colors.blue}
        onPress={uploadPhotoHandler}
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
          onPress={openCameraHandler}
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

      <AwesomeAlert
        show={!!tempImageUri}
        title='Send image?'
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText='Cancel'
        confirmText='Send image'
        confirmButtonColor={Colors.primary}
        cancelButtonColor={Colors.red}
        titleStyle={styles.popupTitle}
        onCancelPressed={uploadPhotoCancelHandler}
        onConfirmPressed={uploadPhotoConfirmHandler}
        customView={
          <View>
            {isLoading || !tempImageUri ? (
              <ActivityIndicator
                size='large'
                color={Colors.primary}
                style={styles.popupImage}
              />
            ) : (
              <Image source={{ uri: tempImageUri }} style={styles.popupImage} />
            )}
          </View>
        }
      />
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
  popupTitle: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: Colors.textColor,
  },
  popupImage: {
    width: 200,
    height: 200,
  },
});
