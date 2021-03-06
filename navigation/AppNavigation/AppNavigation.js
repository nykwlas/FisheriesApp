import React from 'react';
import {StyleSheet, Platform, SafeAreaView, Button, View} from 'react-native';
import {useDispatch} from 'react-redux';

import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';

import Icon from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import Settings from '../../screens/Settings';
import defaultNavOptions from '../DefaultNavOptions';
import HomeTabNavigator from './BottomNavigation';

const SettingsNavigator = createStackNavigator(
  {
    Settings: Settings,
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Icon
          name={Platform.OS === 'android' ? 'md-settings' : 'ios-settings'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  },
);

const AppNavigation = createDrawerNavigator(
  {
    Home: {
      screen: HomeTabNavigator,
      navigationOptions: {
        drawerIcon: drawerConfig => (
          <Icon
            name={Platform.OS === 'android' ? 'md-boat' : 'ios-boat'}
            size={23}
            color={drawerConfig.tintColor}
          />
        ),
      },
    },
    Settings: SettingsNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: props => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const dispatch = useDispatch();
      return (
        <View style={styles.button}>
          <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                props.navigation.navigate('Auth');
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  },
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingTop: 20,
  },
});

export default AppNavigation;
