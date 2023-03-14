import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PageContainer from '../components/UI/PageContainer';
import DataItem from '../components/UI/DataItem';
import { Colors, Screens } from '../utils/constants';
import { useLayoutEffect } from 'react';

export default function UsersInGroupScreen({ navigation, route }) {
  const { chatId } = route.params;
  const userData = useSelector((state) => state.auth.userData);
  const chatData = useSelector(
    (state) => state.chats.chatsData[chatId] || { users: [] }
  );
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const currentUserIsGroupOwner = chatData.createdBy === userData.userId;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Group: ${chatData.groupName}`,
    });
  }, [navigation, chatData]);

  return (
    <PageContainer ignoreTop isView>
      <View style={styles.usersContainer}>
        <Text style={styles.heading}>
          {chatData.users.length}{' '}
          {chatData.users.length === 1 ? 'Participant' : 'Participants'} in
          Group
        </Text>

        <FlatList
          data={chatData.users}
          keyExtractor={(uid) => uid}
          renderItem={({ item: uid }) => {
            const user = storedUsers[uid];
            if (!user) return;
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
                  navigation.navigate(Screens.Contact, {
                    userId: user.userId,
                    selectedChatId: currentUserIsGroupOwner
                      ? chatId
                      : undefined,
                  });
                }}
              />
            );
          }}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  usersContainer: {
    width: '100%',
    marginTop: 10,
  },
  heading: {
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: Colors.textColor,
    marginVertical: 8,
  },
});
