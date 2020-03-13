import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

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
    headerTitle: 'Library',
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
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    color: '#F57C00',
  },
});

export default Statistics;
