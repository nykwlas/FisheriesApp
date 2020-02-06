import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Colors from '../../constants/Colors';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {StyleSheet, Platform, SafeAreaView, Button, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeTabNavigator from './BottomNavigator';
import Firebase from '../../config/Firebase';
import Settings from '../../screens/Settings';
import defaultNavOptions from '../DefaultNavOptions';

const handleSignout = async props => {
  try {
    await Firebase.signOut();
  } catch (error) {
    console.log(error);
  }
};

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
    // Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: props => {
      return (
        <View style={styles.button}>
          <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={handleSignout}
            />
          </SafeAreaView>
        </View>
      );
    },
  },
);

const styles = StyleSheet.create({
  button: {flex: 1, paddingTop: 20},
});

export default AppNavigation;
