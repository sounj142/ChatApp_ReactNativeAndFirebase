import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import uuid from 'uuid';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../../utils/constants';
import MenuItem from './MenuItem';
import { toggleStarMessage } from '../../firebase/chat';
import { formatTime } from '../../utils/helper';

export default function Bubble({
  userId,
  chatId,
  messageId,
  text,
  type,
  isStarred,
  sentAt,
}) {
  const menuRef = useRef(null);
  const id = useRef(uuid.v4());

  const containerStyle = { ...styles.container };
  const innerContainerStyle = { ...styles.innerContainer };
  const textStyle = { ...styles.text };

  let touchable = false;
  switch (type) {
    case 'system':
      textStyle.color = '#65644a';
      innerContainerStyle.backgroundColor = Colors.beige;
      innerContainerStyle.marginTop = 10;
      innerContainerStyle.width = '100%';
      textStyle.textAlign = 'center';
      break;
    case 'error':
      textStyle.color = 'white';
      innerContainerStyle.backgroundColor = Colors.red;
      innerContainerStyle.marginTop = 10;
      innerContainerStyle.width = '100%';
      textStyle.textAlign = 'center';
      break;
    case 'myMessage':
      containerStyle.justifyContent = 'flex-end';
      innerContainerStyle.backgroundColor = '#e7fed6';
      innerContainerStyle.maxWidth = '90%';
      touchable = true;
      break;
    case 'theirMessage':
      containerStyle.justifyContent = 'flex-start';
      innerContainerStyle.maxWidth = '90%';
      touchable = true;
      break;
  }

  function bubbleLongPressHandler() {
    if (!touchable) return;
    menuRef.current.props.ctx.menuActions.openMenu(id.current);
  }

  function copyMessageToClipboardHandler() {
    return Clipboard.setStringAsync(text);
  }

  function toggleStarHandler() {
    return toggleStarMessage(userId, chatId, messageId);
  }

  const dateFormatted = formatTime(sentAt);

  return (
    <Pressable style={containerStyle} onLongPress={bubbleLongPressHandler}>
      <View style={innerContainerStyle}>
        <Text style={textStyle}>{text}</Text>

        {dateFormatted && (
          <View style={styles.timeContainer}>
            {isStarred && (
              <Ionicons
                name='star'
                size={14}
                color={Colors.textColor}
                style={styles.starIcon}
              />
            )}
            <Text style={styles.time}>{dateFormatted}</Text>
          </View>
        )}

        {touchable && (
          <Menu ref={menuRef} name={id.current}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem
                text='Copy to clipboard'
                onSelect={copyMessageToClipboardHandler}
                icon='copy'
                iconPack={Feather}
              />
              <MenuItem
                text='Star message'
                icon={isStarred ? 'star' : 'star-outline'}
                onSelect={toggleStarHandler}
              />
            </MenuOptions>
          </Menu>
        )}
      </View>
    </Pressable>
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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  starIcon: {
    marginRight: 5,
  },
  time: {
    fontFamily: 'regular',
    fontSize: 12,
    letterSpacing: 0.3,
    color: Colors.grey,
  },
});
