import React from 'react';
// import {Platform} from 'react-native';
import {StyleSheet} from 'react-native';
import {HeaderButton} from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      style={styles.butt}
      IconComponent={Icon}
      iconSize={30}
      color={/*Platform.OS === 'android' ? 'white' :*/ Colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  butt: {
    marginRight: 5,
  },
});

export default CustomHeaderButton;
