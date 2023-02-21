import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import SignUpForm from '../components/Auth/SignUpForm';
import Logo from '../components/UI/Logo';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import PageContainer from '../components/UI/PageContainer';
import { signUp } from '../firebase/auth';
import { authenticate } from '../store/authSlice';

export default function SignUpScreen() {
  const dispatch = useDispatch();

  async function signUpHandler(formData) {
    const res = await signUp(formData);
    if (!res.succeed) {
      Alert.alert('An error occurred', res.errorMessage);
      return;
    }
    dispatch(authenticate({ userData: res.userData }));
  }

  return (
    <PageContainer>
      <MyKeyboardAvoidingView>
        <Logo />

        <SignUpForm onSubmit={signUpHandler} />
      </MyKeyboardAvoidingView>
    </PageContainer>
  );
}
