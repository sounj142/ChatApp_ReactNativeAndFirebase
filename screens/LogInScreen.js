import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import LogInForm from '../components/Auth/LogInForm';
import Logo from '../components/UI/Logo';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';
import PageContainer from '../components/UI/PageContainer';
import { logIn } from '../firebase/auth';
import { authenticate } from '../store/authSlice';

export default function LogInScreen() {
  const dispatch = useDispatch();

  async function logInHandler(formData) {
    const res = await logIn(formData);
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
        <LogInForm onSubmit={logInHandler} />
      </MyKeyboardAvoidingView>
    </PageContainer>
  );
}
