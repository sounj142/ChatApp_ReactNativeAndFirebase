import { useCallback, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { modalStyles } from '../../utils/styles';
import Input from '../UI/Input';
import MyButton from '../UI/MyButton';

const validationSchema = Yup.object({
  password: Yup.string().required('Password is required.'),
});

export default function ConfirmPasswordDialog({ visible, onOk, onCancel }) {
  const okHandler = useCallback(
    async (values) => {
      await onOk(values.password);
    },
    [onOk]
  );

  return (
    <Modal animationType='slide' transparent={true} visible={visible}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Formik
            initialValues={{
              password: '',
            }}
            onSubmit={okHandler}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              dirty,
              isValid,
              isSubmitting,
            }) => (
              <>
                <Input
                  label='You are changing email. Please confirm your password.'
                  icon='lock-closed-outline'
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  errorMessage={touched.password ? errors.password : undefined}
                />

                <View style={styles.buttonsContainer}>
                  <MyButton onPress={onCancel} style={styles.button1}>
                    Cancel
                  </MyButton>

                  <MyButton
                    onPress={handleSubmit}
                    style={styles.button2}
                    isLoading={isSubmitting}
                    disabled={!isValid || !dirty || isSubmitting}
                  >
                    Ok
                  </MyButton>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button1: {
    width: 100,
    marginRight: 12,
  },
  button2: {
    width: 100,
    marginLeft: 12,
  },
});
