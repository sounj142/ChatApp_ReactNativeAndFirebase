import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import SettingsProfileImage from '../components/Settings/SettingsProfileImage';
import PageContainer from '../components/UI/PageContainer';
import PageTitle from '../components/UI/PageTitle';
import defaultImage from '../assets/images/group.jpg';
import { deleteTempImage } from '../utils/imagePickerHelper';
import {
  deleteImageAsync,
  uploadGroupChatImageAsync,
} from '../firebase/storage';
import { updateChat } from '../firebase/chat';
import Input from '../components/UI/Input';
import MyButton from '../components/UI/MyButton';
import DataItem from '../components/UI/DataItem';
import { Colors, Screens } from '../utils/constants';
import DataItemButton from '../components/UI/DataItemButton';

export default function ChatSettingsScreen({ navigation, route }) {
  const { chatId } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const chatData = useSelector((state) => state.chats.chatsData[chatId]);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const [image, setImage] = useState(chatData.imageUri);
  const [groupName, setGroupName] = useState(chatData.groupName);
  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    if (chatData.imageUri !== image) setImage(chatData.imageUri);
  }, [chatData.imageUri]);

  async function submitHandler() {
    if (isSubmiting) return;

    const imageUri = image;
    setIsSubmiting(true);
    try {
      const needUploadImage = imageUri && imageUri !== chatData.imageUri;
      let uploadedUrl = undefined;
      let oldImage = undefined;
      if (needUploadImage) {
        uploadedUrl = await uploadGroupChatImageAsync(imageUri);
        oldImage = chatData.imageUri;
      }
      await updateChat(chatId, userData.userId, uploadedUrl, groupName.trim());

      if (needUploadImage) {
        if (oldImage) await deleteImageAsync(oldImage);
        await deleteTempImage(imageUri);
      }
    } finally {
      setIsSubmiting(false);
    }
  }

  return (
    <PageContainer ignoreTop isView>
      <PageTitle title='Chat Settings' />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <SettingsProfileImage
          size={100}
          image={image}
          setImage={setImage}
          defaultImage={defaultImage}
          parentSubmitting={isSubmiting}
        />

        <Input
          label='Group name'
          onChangeText={(text) => setGroupName(text)}
          value={groupName}
        />

        {(groupName !== chatData.groupName || image !== chatData.imageUri) && (
          <MyButton
            onPress={submitHandler}
            isLoading={isSubmiting}
            disabled={isSubmiting || !groupName.trim().length}
          >
            Save Changes
          </MyButton>
        )}

        <View style={styles.usersContainer}>
          <Text style={styles.heading}>
            {chatData.users.length}{' '}
            {chatData.users.length === 1 ? 'Participant' : 'Participants'} in
            Group
          </Text>

          <DataItemButton title='Add users' icon='add' color={Colors.blue} />

          {chatData.users.map((uid) => {
            const user = storedUsers[uid];
            const isCurrentUser = user.userId === userData.userId;
            return (
              <DataItem
                key={user.userId}
                title={user.fullName}
                subTitle={user.about}
                imageUri={user.imageUri}
                icon={isCurrentUser ? undefined : 'chevron-forward-outline'}
                notPressable={isCurrentUser}
                onPress={() => {
                  navigation.navigate(Screens.Contact, { userId: user.userId });
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  usersContainer: {
    width: '100%',
    marginTop: 10,
  },
  heading: {
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: Colors.textColor,
    marginVertical: 8,
    textAlign: 'center',
  },
});
