import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../utils/constants';

export default function Bubble({ text, type }) {
  const innerContainerStyle = { ...styles.innerContainer };
  const textStyle = { ...styles.text };

  switch (type) {
    case 'system':
      textStyle.color = '#65644a';
      innerContainerStyle.backgroundColor = Colors.beige;
      innerContainerStyle.alignItems = 'center';
      innerContainerStyle.marginTop = 10;
      break;
  }

  return (
    <View style={styles.container}>
      <View style={innerContainerStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: '#e2dacc',
    borderWidth: 1,
  },
  text: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});
