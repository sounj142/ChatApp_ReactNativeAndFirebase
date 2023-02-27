import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../utils/constants';

export default function Bubble({ text, type }) {
  const containerStyle = { ...styles.container };
  const innerContainerStyle = { ...styles.innerContainer };
  const textStyle = { ...styles.text };

  switch (type) {
    case 'system':
      textStyle.color = '#65644a';
      innerContainerStyle.backgroundColor = Colors.beige;
      innerContainerStyle.marginTop = 10;
      break;
    case 'error':
      textStyle.color = 'white';
      innerContainerStyle.backgroundColor = Colors.red;
      innerContainerStyle.marginTop = 10;
      break;
    case 'myMessage':
      containerStyle.justifyContent = 'flex-end';
      innerContainerStyle.backgroundColor = '#e7fed6';
      innerContainerStyle.maxWidth = '90%';
      break;
    case 'theirMessage':
      containerStyle.justifyContent = 'flex-start';
      innerContainerStyle.maxWidth = '90%';
      break;
  }

  return (
    <View style={containerStyle}>
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
    paddingHorizontal: 20,
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
