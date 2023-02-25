import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Input from '../UI/Input';
import MyButton from '../UI/MyButton';
import { useCallback, useEffect, useState } from 'react';
import SettingsProfileImage from './SettingsProfileImage';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required.'),
  lastName: Yup.string().required('Last name is required.'),
  email: Yup.string()
    .required('Email is required.')
    .email('Email must be a valid email.'),
});

export default function SettingsForm({ userData, onSubmit }) {
  const [image, setImage] = useState(userData.imageUri);

  const submitHandler = useCallback(
    async (values, { resetForm }) => {
      const succeed = await onSubmit({ ...values, imageUri: image });
      if (succeed) resetForm({ values: values });
    },
    [onSubmit, image]
  );

  useEffect(() => {
    if (userData.imageUri !== image) setImage(userData.imageUri);
  }, [userData.imageUri]);

  return (
    <Formik
      initialValues={{
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        about: userData.about || '',
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
          <SettingsProfileImage size={100} image={image} setImage={setImage} />

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
            label='About'
            icon='information-circle-outline'
            onChangeText={handleChange('about')}
            onBlur={handleBlur('about')}
            value={values.about}
            errorMessage={touched.about ? errors.about : undefined}
          />

          <MyButton
            onPress={handleSubmit}
            style={styles.saveButton}
            isLoading={isSubmitting}
            disabled={
              !isValid ||
              !(dirty || image !== userData.imageUri) ||
              isSubmitting
            }
          >
            Save
          </MyButton>
        </>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    marginTop: 20,
  },
});
