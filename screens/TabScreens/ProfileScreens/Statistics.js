import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Colors from '../../../constants/Colors';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../../components/Buttons/HeaderButton';

const Statistics = props => {
  return (
    <View style={styles.container}>
      <Text>Statistics</Text>
    </View>
  );
};

Statistics.navigationOptions = navData => {
  return {
    headerTitle: 'Statistics',
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    color: '#F57C00',
  },
});

export default Statistics;
