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
  firstName: Yup.string().required('First name is required.'),
  lastName: Yup.string().required('Last name is required.'),
  email: Yup.string()
    .required('Email is required.')
    .email('Email must be a valid email.'),
  password: Yup.string()
    .required('Password is required.')
    .min(6, 'Password must have at least 6 characters.'),
  confirmPassword: Yup.string().test(
    'passwords-match',
    'Confirm password must match.',
    function (value) {
      return this.parent.password === value;
    }
  ),
});

export default function SignUpForm({ onSubmit }) {
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
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
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
            label='First Name'
            icon='person-circle'
            onChangeText={handleChange('firstName')}
            onBlur={handleBlur('firstName')}
            value={values.firstName}
            errorMessage={touched.firstName ? errors.firstName : undefined}
          />
          <Input
            label='Last Name'
            icon='person-circle'
            onChangeText={handleChange('lastName')}
            onBlur={handleBlur('lastName')}
            value={values.lastName}
            errorMessage={touched.lastName ? errors.lastName : undefined}
          />
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
          <Input
            label='Confirm Password'
            icon='lock-closed-outline'
            secureTextEntry
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
            errorMessage={
              touched.confirmPassword ? errors.confirmPassword : undefined
            }
          />

          <MyButton
            onPress={handleSubmit}
            style={styles.signUpButton}
            isLoading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
          >
            Sign Up
          </MyButton>
          <TextLink onPress={() => navigation.replace(Screens.LogIn)}>
            Switch to log in
          </TextLink>
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  signUpButton: {
    marginTop: 20,
  },
});
