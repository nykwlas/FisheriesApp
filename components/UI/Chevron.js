import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import Colors from '../../constants/Colors';

const Chevron = () => (
  <Icon
    name="chevron-right"
    type="entypo"
    color={Colors.lightGray2}
    containerStyle={styles.icon}
  />
);

const styles = StyleSheet.create({
  icon: {marginLeft: -15, width: 20},
});

export default Chevron;
