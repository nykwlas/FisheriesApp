import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Colors from '../../../constants/Colors';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../../components/Buttons/HeaderButton';

const Licences = props => {
  return (
    <View style={styles.container}>
      <Text>Licences</Text>
    </View>
  );
};

Licences.navigationOptions = navData => {
  return {
    headerTitle: 'Licences',
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

export default Licences;
