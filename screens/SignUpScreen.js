import SignUpForm from '../components/Auth/SignUpForm';
import Logo from '../components/UI/Logo';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import PageContainer from '../components/UI/PageContainer';

export default function SignUpScreen() {
  function signUpHandler() {}

  console.log('SignUpScreen');

  return (
    <PageContainer>
      <MyKeyboardAvoidingView>
        <Logo />

        <SignUpForm onSubmit={signUpHandler} />
      </MyKeyboardAvoidingView>
    </PageContainer>
  );
}
