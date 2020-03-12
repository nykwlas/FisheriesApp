import React, {useState, Fragment} from 'react';
import {StyleSheet, SafeAreaView, View, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';

import {Button, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import {Formik} from 'formik';
import * as Yup from 'yup';

import FormInput from '../../components/Input/FormInput';
import FormButton from '../../components/Buttons/FormButton';
import ErrorMessage from '../../components/Input/ErrorMessage';
import * as authActions from '../../store/actions/auth';
import Colors from '../../constants/Colors';
// import firebaseConfig from '../../config/Firebase/firebaseConfig';
// import * as firebase from 'firebase/app';
// import 'firebase/storage';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password should be at least 6 characters '),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must matched Password')
    .required('Confirm Password is required'),
  check: Yup.boolean().oneOf([true], 'Please check the agreement'),
});

const Signup = props => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(
    true,
  );
  const [passwordIcon, setPasswordIcon] = useState('ios-eye');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('ios-eye');

  const [nameField, setNameField] = useState('');
  const [emailField, setEmailField] = useState('');
  const [passwordField, setPasswordField] = useState('');
  const [passwordConfirmField, setPasswordConfirmField] = useState('');
  const [checkField, setCheckField] = useState(false);

  const dispatch = useDispatch();

  const goToLogin = () => props.navigation.navigate('Login');

  const handlePasswordVisibility = () => {
    setPasswordIcon(prevState =>
      prevState === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
    );
    setPasswordVisibility(prevState => !prevState);
  };

  const handleConfirmPasswordVisibility = () => {
    setConfirmPasswordIcon(prevState =>
      prevState === 'ios-eye' ? 'ios-eye-off' : 'ios-eye',
    );
    setConfirmPasswordVisibility(prevState => !prevState);
  };

  const handleOnSignup = async (values, actions) => {
    const {email, password, name} = values;
    const action = authActions.signup(email, password);
    try {
      await dispatch(action).then(async () => {
        try {
          await dispatch(authActions.updateProfileName(name));
          await dispatch(authActions.getProfile());
        } catch (error) {
          console.log(error);
          actions.setFieldError('general', error.message);
        }
      });
      // firebase.initializeApp(firebaseConfig);
      props.navigation.navigate('App');
    } catch (error) {
      actions.setFieldError('general', error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        validateOnMount
        initialValues={{
          name: nameField,
          email: emailField,
          password: passwordField,
          confirmPassword: passwordConfirmField,
          check: checkField,
        }}
        onSubmit={(values, actions) => {
          handleOnSignup(values, actions);
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
          setFieldValue,
        }) => (
          <Fragment>
            <FormInput
              name="name"
              value={values.name}
              onChangeText={(setNameField(values.name), handleChange('name'))}
              placeholder="Enter your full name"
              iconName="md-person"
              iconColor="#2C384A"
              onBlur={handleBlur('name')}
            />
            <ErrorMessage errorValue={touched.name && errors.name} />
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
              iconName="ios-lock"
              iconColor="#2C384A"
              onBlur={handleBlur('password')}
              secureTextEntry={passwordVisibility}
              rightIcon={
                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Icon name={passwordIcon} size={28} color="grey" />
                </TouchableOpacity>
              }
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            <FormInput
              name="confirmPassword"
              value={values.confirmPassword}
              onChangeText={
                (setPasswordConfirmField(values.confirmPassword),
                handleChange('confirmPassword'))
              }
              placeholder="Confirm password"
              iconName="ios-lock"
              iconColor="#2C384A"
              onBlur={handleBlur('confirmPassword')}
              secureTextEntry={confirmPasswordVisibility}
              rightIcon={
                <TouchableOpacity onPress={handleConfirmPasswordVisibility}>
                  <Icon name={confirmPasswordIcon} size={28} color="grey" />
                </TouchableOpacity>
              }
            />
            <ErrorMessage
              errorValue={touched.confirmPassword && errors.confirmPassword}
            />
            <CheckBox
              containerStyle={styles.checkBoxContainer}
              checkedIcon="check-box"
              iconType="material"
              uncheckedIcon="check-box-outline-blank"
              title="Agree to terms and conditions"
              checkedTitle="You agreed to our terms and conditions"
              checked={values.check}
              onPress={() => {
                setCheckField(prevState => !prevState);
                setFieldValue('check', !values.check);
              }}
            />
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="SIGNUP"
                buttonColor="#F57C00"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />
            </View>
            <ErrorMessage errorValue={errors.general} />
          </Fragment>
        )}
      </Formik>
      <Button
        title="Have an account? Login"
        onPress={goToLogin}
        titleStyle={styles.loginTitle}
        type="clear"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 25,
  },
  checkBoxContainer: {
    backgroundColor: Colors.background,
    borderColor: Colors.background,
  },
  loginTitle: {
    color: '#039BE5',
  },
});

export default Signup;
