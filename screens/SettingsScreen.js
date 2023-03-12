import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SettingsForm from '../components/Settings/SettingsForm';
import ConfirmPasswordDialog from '../components/Settings/ConfirmPasswordDialog';
import PageContainer from '../components/UI/PageContainer';
import { useEffect, useState } from 'react';
import { updateUser } from '../firebase/auth';
import SettingsTitle from '../components/Settings/SettingsTitle';
import MyKeyboardAvoidingView from '../components/UI/MyKeyboardAvoidingView';

let tempFormData;
let promiseResolve;

export default function SettingsScreen({ navigation }) {
  const userData = useSelector((state) => state.auth.userData);
  const [showConfirmPasswordDialog, setShowConfirmPasswordDialog] =
    useState(false);
  // we need this ver to force UI rerender to reset unsaved changes
  const [uiVer, setUiVer] = useState(1);

  // clear temp data
  useEffect(() => {
    return () => {
      tempFormData = null;
      promiseResolve = null;
    };
  }, []);

  async function saveSetings(formData) {
    const res = await updateUser({ ...userData, ...formData }, userData);
    if (!res.succeed) {
      Alert.alert('An error occurred', res.errorMessage);
      return false;
    }
    return true;
  }

  async function saveSetingsHandler(formData) {
    if (formData.email !== userData.email) {
      tempFormData = formData;
      setShowConfirmPasswordDialog(true);
      return await new Promise((resolve) => {
        promiseResolve = resolve;
      });
    }
    return await saveSetings(formData);
  }

  async function confirmPasswordHandler(password) {
    const result = await saveSetings({ ...tempFormData, password });
    promiseResolve(result);
    setShowConfirmPasswordDialog(false);
  }

  async function cancelPasswordHandler() {
    promiseResolve(false);
    setShowConfirmPasswordDialog(false);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', async (e) => {
      setUiVer((ver) => ver + 1);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <PageContainer ignoreTop>
      <MyKeyboardAvoidingView>
        <ConfirmPasswordDialog
          visible={showConfirmPasswordDialog}
          onCancel={cancelPasswordHandler}
          onOk={confirmPasswordHandler}
        />
        <SettingsTitle />

        <SettingsForm
          key={uiVer}
          onSubmit={saveSetingsHandler}
          userData={userData}
        />
      </MyKeyboardAvoidingView>
    </PageContainer>
  );
}
