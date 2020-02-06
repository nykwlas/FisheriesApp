import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Colors from '../constants/Colors';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  Button,
  View,
} from 'react-native';
import Home from '../screens/TabScreens/Home';
import Profile from '../screens/TabScreens/Profile';
import Library from '../screens/TabScreens/Library';
import Weather from '../screens/TabScreens/Weather';
import Scores from '../screens/TabScreens/Scores';

import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Firebase from '../config/Firebase';
import Settings from '../screens/Settings';

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

const HomeNavigator = createStackNavigator(
  {
    Home: Home,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  },
);

const tabScreenConfig = {
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Icon name="ios-person" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primaryColor,
      tabBarLabel:
        Platform.OS === 'android' ? (
          <Text style={{fontFamily: 'open-sans-bold'}}>Profile</Text>
        ) : (
          'Profile'
        ),
    },
  },
  Library: {
    screen: Library,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Icon name="ios-book" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primaryColor,
      tabBarLabel:
        Platform.OS === 'android' ? (
          <Text style={{fontFamily: 'open-sans-bold'}}>Library</Text>
        ) : (
          'Library'
        ),
    },
  },
  Home: {
    screen: HomeNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Icon name="ios-home" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primaryColor,
      tabBarLabel:
        Platform.OS === 'android' ? (
          <Text style={{fontFamily: 'open-sans-bold'}}>Home</Text>
        ) : (
          'Home'
        ),
    },
  },
  Scores: {
    screen: Scores,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return (
          <Icon name="ios-star-outline" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primaryColor,
      tabBarLabel:
        Platform.OS === 'android' ? (
          <Text style={{fontFamily: 'open-sans-bold'}}>Scores</Text>
        ) : (
          'Scores'
        ),
    },
  },
  Weather: {
    screen: Weather,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Icon name="ios-sunny" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primaryColor,
      tabBarLabel:
        Platform.OS === 'android' ? (
          <Text style={{fontFamily: 'open-sans-bold'}}>Weather</Text>
        ) : (
          'Weather'
        ),
    },
  },
};

const HomeTabNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeTintColor: 'white',
        // shifting: true,
        barStyle: {
          backgroundColor: Colors.primaryColor,
        },
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          labelStyle: {
            fontTabFamily: 'open-sans',
          },
          activeTintColor: Colors.accentColor,
        },
      });

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
