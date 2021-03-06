import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Colors from '../../constants/Colors';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/Buttons/HeaderButton';

const Score = props => {
  return (
    <View style={styles.container}>
      <Text>Score</Text>
    </View>
  );
};

Score.navigationOptions = navData => {
  return {
    headerTitle: 'Score',
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
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    color: '#F57C00',
  },
});

export default Score;
