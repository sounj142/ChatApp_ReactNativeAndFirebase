import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SettingsForm from '../components/Settings/SettingsForm';
import ConfirmPasswordDialog from '../components/Settings/ConfirmPasswordDialog';
import PageContainer from '../components/UI/PageContainer';
import { useState } from 'react';
import { updateUser } from '../firebase/auth';
import { authenticate } from '../store/authSlice';
import SettingsTitle from '../components/Settings/SettingsTitle';

let tempFormData;
let promiseResolve;

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [showConfirmPasswordDialog, setShowConfirmPasswordDialog] =
    useState(false);

  async function saveSetings(formData) {
    const res = await updateUser({ ...userData, ...formData }, userData);
    if (!res.succeed) {
      Alert.alert('An error occurred', res.errorMessage);
      return false;
    }
    dispatch(authenticate({ userData: res.userData }));
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

  return (
    <PageContainer ignoreTop>
      <ConfirmPasswordDialog
        visible={showConfirmPasswordDialog}
        onCancel={cancelPasswordHandler}
        onOk={confirmPasswordHandler}
      />
      <SettingsTitle />

      <SettingsForm onSubmit={saveSetingsHandler} userData={userData} />
    </PageContainer>
  );
}
