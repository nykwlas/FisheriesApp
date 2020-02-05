import {createStackNavigator} from 'react-navigation-stack';
import {Platform} from 'react-native';
import Colors from '../constants/Colors';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ForgotPassword from '../screens/ForgotPassword';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

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
