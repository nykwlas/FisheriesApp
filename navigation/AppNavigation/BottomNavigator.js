import React from 'react';
import {Text, Platform} from 'react-native';
import Profile from '../../screens/TabScreens/Profile';
import Library from '../../screens/TabScreens/Library';
import Weather from '../../screens/TabScreens/Weather';
import Scores from '../../screens/TabScreens/Scores';
import Home from '../../screens/TabScreens/HomeScreens/Home';
import RecordDetail from '../../screens/TabScreens/HomeScreens/RecordDetail';
import RecordForm from '../../screens/TabScreens/HomeScreens/RecordForm';
import Colors from '../../constants/Colors';
import defaultNavOptions from '../DefaultNavOptions';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  createBottomTabNavigator,
  // createMaterialTopTabNavigator,
} from 'react-navigation-tabs';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation-stack';

const ProfileNavigator = createStackNavigator(
  {
    Profile: Profile,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    // headerMode: 'none',
    // navigationOptions: {
    //   headerVisible: false,
    // },
  },
);

const LibraryNavigator = createStackNavigator(
  {
    Library: Library,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    // headerMode: 'none',
    // navigationOptions: {
    //   headerVisible: false,
    // },
  },
);

const HomeNavigator = createStackNavigator(
  {
    Home: Home,
    RecordForm: RecordForm,
    Record: RecordDetail,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    // headerMode: 'none',
    // navigationOptions: {
    //   headerVisible: false,
    // },
  },
);

const ScoresNavigator = createStackNavigator(
  {
    Scores: Scores,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    // headerMode: 'none',
    // navigationOptions: {
    //   headerVisible: false,
    // },
  },
);

const WeatherNavigator = createStackNavigator(
  {
    Weather: Weather,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    // headerMode: 'none',
    // navigationOptions: {
    //   headerVisible: false,
    // },
  },
);

const tabScreenConfig = {
  Profile: {
    screen: ProfileNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Icon name="ios-person" size={25} color={tabInfo.tintColor} />;
      },
      // tabBarOptions: {
      //   showIcon: true,
      //   // showLabel: false,
      // },
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
    screen: LibraryNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Icon name="ios-book" size={25} color={tabInfo.tintColor} />;
      },
      // tabBarOptions: {
      //   showIcon: true,
      //   // showLabel: false,
      // },
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
      // tabBarOptions: {
      //   showIcon: true,
      //   // showLabel: false,
      // },
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
    screen: ScoresNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return (
          <Icon name="ios-star-outline" size={25} color={tabInfo.tintColor} />
        );
      },
      // tabBarOptions: {
      //   showIcon: true,
      //   // showLabel: false,
      // },
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
    screen: WeatherNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Icon name="ios-sunny" size={25} color={tabInfo.tintColor} />;
      },
      // tabBarOptions: {
      //   showIcon: true,
      //   // showLabel: false,
      // },
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
        // swipeEnabled: true,
        // tabBarPosition: 'bottom',
        initialRouteName: 'Home',
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

export default HomeTabNavigator;
