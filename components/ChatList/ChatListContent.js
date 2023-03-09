import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Colors } from '../../utils/constants';
import DataItem from '../UI/DataItem';
import { commonStyles } from '../../utils/styles';

export default function ChatListContent({
  searchText,
  isLoading,
  users,
  onUserSelected,
  isGroupChat,
  selectedUsers,
}) {
  if (!searchText)
    return (
      <View style={commonStyles.center}>
        <Ionicons
          name='people-sharp'
          size={55}
          color={Colors.lightGrey}
          style={styles.searchEmptyIcon}
        />
        <Text style={styles.searchEmptyText}>
          Enter a name to search for a user.
        </Text>
      </View>
    );

  if (isLoading)
    return (
      <View style={commonStyles.center}>
        <ActivityIndicator size={50} color={Colors.primary} />
      </View>
    );

  if (!users)
    return (
      <View style={commonStyles.center}>
        <Octicons
          name='question'
          size={55}
          color={Colors.lightGrey}
          style={styles.searchEmptyIcon}
        />

        <Text style={styles.searchEmptyText}>No users found.</Text>
      </View>
    );

  return (
    <FlatList
      data={Object.entries(users)}
      keyExtractor={(item) => item[0]}
      renderItem={({ item }) => {
        const user = item[1];
        const isChecked = !!selectedUsers.find((u) => u.userId === user.userId);
        return (
          <DataItem
            title={user.fullName}
            subTitle={user.about}
            imageUri={user.imageUri}
            onPress={() => onUserSelected({ ...user })}
            type={isGroupChat ? 'checkbox' : undefined}
            isChecked={isChecked}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  searchEmptyIcon: {
    marginBottom: 20,
  },
  searchEmptyText: {
    color: Colors.textColor,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});
