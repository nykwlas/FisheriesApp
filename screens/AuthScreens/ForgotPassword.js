import React, {Fragment} from 'react';
import {Text, SafeAreaView, View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';

import {Formik} from 'formik';
import * as Yup from 'yup';

import FormInput from '../../components/Input/FormInput';
import FormButton from '../../components/Buttons/FormButton';
import ErrorMessage from '../../components/Input/ErrorMessage';
import * as authActions from '../../store/actions/auth';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
});

const ForgotPassword = props => {
  const dispatch = useDispatch();

  const handlePasswordReset = async (values, actions) => {
    const {email} = values;
    const action = authActions.resetPassword(email);
    try {
      await dispatch(action);
      console.log('Password reset email sent successfully');
      props.navigation.navigate('Login');
    } catch (error) {
      actions.setFieldError('general', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Forgot Password?</Text>
      <Formik
        validateOnMount
        initialValues={{email: ''}}
        onSubmit={(values, actions) => {
          handlePasswordReset(values, actions);
        }}
        validationSchema={validationSchema}>
        {({
          handleChange,
          values,
          handleSubmit,
          errors,
          isValid,
          touched,
          handleBlur,
          isSubmitting,
        }) => (
          <Fragment>
            <FormInput
              name="email"
              value={values.email}
              onChangeText={handleChange('email')}
              placeholder="Enter email"
              autoCapitalize="none"
              iconName="ios-mail"
              iconColor="#2C384A"
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="Send Email"
                buttonColor="#039BE5"
                disabled={!isValid || isSubmitting}
              />
            </View>
            <ErrorMessage errorValue={errors.general} />
          </Fragment>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    // backgroundColor: '#fff',
  },
  text: {
    color: '#333',
    fontSize: 24,
    marginLeft: 25,
  },
  buttonContainer: {
    margin: 25,
  },
});

export default ForgotPassword;
