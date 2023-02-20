import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Input from '../UI/Input';
import MyButton from '../UI/MyButton';
import TextLink from '../UI/TextLink';
import { Screens } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required.')
    .email('Email must be a valid email.'),
  password: Yup.string().required('Password is required.'),
});

export default function LogInForm({ onSubmit }) {
  const navigation = useNavigation();

  const submitHandler = useCallback(
    async (values) => {
      await onSubmit({ ...values });
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={submitHandler}
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
            label='Email'
            icon='md-mail-outline'
            autoCapitalize='none'
            keyboardType='email-address'
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            errorMessage={touched.email ? errors.email : undefined}
          />
          <Input
            label='Password'
            icon='lock-closed-outline'
            secureTextEntry
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            errorMessage={touched.password ? errors.password : undefined}
          />

          <MyButton
            onPress={handleSubmit}
            style={styles.logInButton}
            isLoading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
          >
            Log In
          </MyButton>
          <TextLink onPress={() => navigation.replace(Screens.SignUp)}>
            Switch to sign up
          </TextLink>
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  logInButton: {
    marginTop: 20,
  },
});
