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

export default function ChatListContent({
  searchText,
  isLoading,
  users,
  onUserSelected,
}) {
  if (!searchText)
    return (
      <View style={styles.center}>
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
      <View style={styles.center}>
        <ActivityIndicator size={50} color={Colors.primary} />
      </View>
    );

  if (!users)
    return (
      <View style={styles.center}>
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
        return (
          <DataItem
            title={user.fullName}
            subTitle={user.about}
            imageUri={user.imageUri}
            onPress={() => onUserSelected({ ...user })}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchEmptyIcon: {
    marginBottom: 20,
  },
  searchEmptyText: {
    color: Colors.textColor,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});
