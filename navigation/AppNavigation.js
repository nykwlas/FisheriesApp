import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Colors from '../constants/Colors';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {StyleSheet, Platform, SafeAreaView, Button, View} from 'react-native';
import Home from '../screens/Home';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../config/Firebase';

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

const handleSignout = async props => {
  try {
    await Firebase.signOut();
  } catch (error) {
    console.log(error);
  }
};

const HomeNavigator = createStackNavigator(
  {
    Home: Home,
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Icon
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
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
    Home: HomeNavigator,
    // Orders: OrdersNavigator,
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
