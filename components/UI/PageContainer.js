import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../utils/styles';

export default function PageContainer({ children, style, ignoreTop, isView }) {
  return (
    <SafeAreaView
      style={commonStyles.flex1}
      edges={ignoreTop ? ['right', 'left', 'bottom'] : undefined}
    >
      {isView ? (
        <View style={[styles.container, style]}>{children}</View>
      ) : (
        <ScrollView style={[styles.scrollContainer, style]}>
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
});
