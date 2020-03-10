import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, Platform, Switch, Button} from 'react-native';
import {useDispatch} from 'react-redux';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../components/Buttons/HeaderButton';
import Colors from '../constants/Colors';

const FilterSwitch = props => {
  return (
    <View style={styles.filterContainer}>
      <Text>{props.label}</Text>
      <Switch
        trackColor={{true: Colors.primaryColor}}
        thumbColor={Platform.OS === 'android' ? Colors.primaryColor : ''}
        value={props.state}
        onValueChange={props.onChange}
      />
    </View>
  );
};

const SettingsScreen = props => {
  const {navigation} = props;

  const [isLicenses, setIsLicenses] = useState(false);
  const [isReports, setIsReports] = useState(false);
  const [isEvents, setIsEvents] = useState(false);
  const [isWeather, setIsWeather] = useState(false);

  const dispatch = useDispatch();

  const saveFilters = useCallback(() => {
    const appliedFilters = {
      Licenses: isLicenses,
      Reports: isReports,
      Events: isEvents,
      Weather: isWeather,
    };

    // dispatch();
    navigation.navigate('Home');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLicenses, isReports, isEvents, isWeather, dispatch]);

  useEffect(() => {
    navigation.setParams({save: saveFilters});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveFilters]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Available Alerts/Notifications</Text>
      <FilterSwitch
        label="Show me Expired Licenses"
        state={isLicenses}
        onChange={newValue => setIsLicenses(newValue)}
      />
      <FilterSwitch
        label="Send reports to my e-mail"
        state={isReports}
        onChange={newValue => setIsReports(newValue)}
      />
      <FilterSwitch
        label="Show me New Events near my location"
        state={isEvents}
        onChange={newValue => setIsEvents(newValue)}
      />
      <FilterSwitch
        label="Alarm on good/bad weather"
        state={isWeather}
        onChange={newValue => setIsWeather(newValue)}
      />
      <Button title="Done" onPress={saveFilters} color={Colors.primary} />
    </View>
  );
};

SettingsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Account Settings',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={navData.navigation.getParam('save')}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 22,
    margin: 20,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginVertical: 15,
  },
});

export default SettingsScreen;
