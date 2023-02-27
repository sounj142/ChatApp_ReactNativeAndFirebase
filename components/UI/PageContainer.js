import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PageContainer({ children, style, ignoreTop, isView }) {
  return (
    <SafeAreaView
      style={styles.safeArea}
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
  safeArea: {
    flex: 1,
  },
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
