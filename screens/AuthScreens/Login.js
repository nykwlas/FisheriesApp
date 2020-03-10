import React, {useState, Fragment} from 'react';
import {StyleSheet, SafeAreaView, View, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';

import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {HideWithKeyboard} from 'react-native-hide-with-keyboard';

import {Formik} from 'formik';
import * as Yup from 'yup';

import FormInput from '../../components/Input/FormInput';
import FormButton from '../../components/Buttons/FormButton';
import ErrorMessage from '../../components/Input/ErrorMessage';
import AppLogo from '../../components/AppLogo';
import * as authActions from '../../store/actions/auth';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have at least 6 characters '),
});

const Login = props => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('ios-eye');
  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');

  const dispatch = useDispatch();

  const goToSignup = () => props.navigation.navigate('Signup');
  const goToForgotPassword = () => props.navigation.navigate('ForgotPassword');

  const handlePasswordVisibility = () => {
    setRightIcon(prevState =>
      prevState === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
    );
    setPasswordVisibility(prevState => !prevState);
  };

  const authHandler = async (values, actions) => {
    const {email, password} = values;
    const action = authActions.login(email, password);
    try {
      await dispatch(action);
      await dispatch(authActions.getProfile());
      props.navigation.navigate('App');
    } catch (error) {
      actions.setFieldError('general', error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HideWithKeyboard style={styles.logoContainer}>
        <AppLogo />
      </HideWithKeyboard>
      <Formik
        validateOnMount
        initialValues={{
          email: emailField,
          password: passwordField,
        }}
        onSubmit={(values, actions) => {
          authHandler(values, actions);
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
              onChangeText={
                (setEmailField(values.email), handleChange('email'))
              }
              placeholder="Enter email"
              autoCapitalize="none"
              iconName="ios-mail"
              iconColor="#2C384A"
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <FormInput
              name="password"
              value={values.password}
              onChangeText={
                (setPasswordField(values.password), handleChange('password'))
              }
              placeholder="Enter password"
              secureTextEntry={passwordVisibility}
              iconName="ios-lock"
              iconColor="#2C384A"
              onBlur={handleBlur('password')}
              rightIcon={
                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Icon name={rightIcon} size={28} color="grey" />
                </TouchableOpacity>
              }
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="LOGIN"
                buttonColor="#039BE5"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />
            </View>
            <ErrorMessage errorValue={errors.general} />
          </Fragment>
        )}
      </Formik>
      <Button
        title="Don't have an account? Sign Up"
        onPress={goToSignup}
        titleStyle={styles.signUpTitle}
        type="clear"
      />
      <Button
        title="Forgot Password?"
        onPress={goToForgotPassword}
        titleStyle={styles.forgotTitle}
        type="clear"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    // backgroundColor: '#fff',
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 15,
    marginHorizontal: 25,
  },
  signUpTitle: {
    color: '#F57C00',
  },
  forgotTitle: {
    color: '#039BE5',
  },
});

export default Login;
