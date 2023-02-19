import { StyleSheet } from 'react-native';
import Input from '../components/UI/Input';
import Logo from '../components/UI/Logo';
import MyButton from '../components/UI/MyButton';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import PageContainer from '../components/UI/PageContainer';
import TextLink from '../components/UI/TextLink';
import { Screens } from '../utils/constants';

export default function SignUpScreen({ navigation }) {
  function signUpHandler() {}

  return (
    <PageContainer>
      <MyKeyboardAvoidingView>
        <Logo />

        <Input label='First Name' icon='person-circle' />
        <Input label='Last Name' icon='person-circle' />
        <Input label='Email' icon='md-mail-outline' />
        <Input label='Password' icon='lock-closed-outline' isPassword={true} />
        <Input
          label='Confirm Password'
          icon='lock-closed-outline'
          isPassword={true}
        />

        <MyButton onPress={signUpHandler} style={styles.signUp}>
          Sign Up
        </MyButton>

        <TextLink onPress={() => navigation.navigate(Screens.LogIn)}>
          Switch to log in
        </TextLink>
      </MyKeyboardAvoidingView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  signUp: {
    marginTop: 20,
  },
});
