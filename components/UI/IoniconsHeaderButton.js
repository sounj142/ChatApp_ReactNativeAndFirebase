import { Ionicons } from '@expo/vector-icons';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Colors } from '../../utils/constants';

export default function IoniconsHeaderButton(props) {
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  return (
    <HeaderButton
      IconComponent={Ionicons}
      iconSize={23}
      {...props}
      color={props.color ?? Colors.blue}
    />
  );
}
