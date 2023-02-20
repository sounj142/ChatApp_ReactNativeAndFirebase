import LogInForm from '../components/Auth/LogInForm';
import Logo from '../components/UI/Logo';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import PageContainer from '../components/UI/PageContainer';

export default function LogInScreen() {
  function logInHandler(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data);
        resolve();
      }, 1000);
    });
  }

  console.log('LogInScreen');

  return (
    <PageContainer>
      <MyKeyboardAvoidingView>
        <Logo />
        <LogInForm onSubmit={logInHandler} />
      </MyKeyboardAvoidingView>
    </PageContainer>
  );
}
