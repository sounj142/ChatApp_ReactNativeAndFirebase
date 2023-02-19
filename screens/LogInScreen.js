import { StyleSheet } from 'react-native';
import Input from '../components/UI/Input';
import Logo from '../components/UI/Logo';
import MyButton from '../components/UI/MyButton';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import PageContainer from '../components/UI/PageContainer';
import TextLink from '../components/UI/TextLink';
import { Screens } from '../utils/constants';

export default function LogInScreen({ navigation }) {
  function logInHandler() {}

  return (
    <PageContainer>
      <MyKeyboardAvoidingView>
        <Logo />

        <Input label='Email' icon='md-mail-outline' />
        <Input label='Password' icon='lock-closed-outline' isPassword={true} />

        <MyButton onPress={logInHandler} style={styles.logIn}>
          Log In
        </MyButton>

        <TextLink onPress={() => navigation.navigate(Screens.SignUp)}>
          Switch to sign up
        </TextLink>
      </MyKeyboardAvoidingView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  logIn: {
    marginTop: 20,
  },
});
