import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../utils/constants';
import { commonStyles } from '../utils/styles';

export default function StartUpScreen() {
  return (
    <View style={commonStyles.center}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  );
}
