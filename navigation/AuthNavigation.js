import {createStackNavigator} from 'react-navigation-stack';

import Login from '../screens/AuthScreens/Login';
import Signup from '../screens/AuthScreens/Signup';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';

import defaultNavOptions from './DefaultNavOptions';

const AuthNavigation = createStackNavigator(
  {
    Login: {screen: Login},
    Signup: {screen: Signup},
    ForgotPassword: {screen: ForgotPassword},
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: defaultNavOptions,
  },
);

export default AuthNavigation;
