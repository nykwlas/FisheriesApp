import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

const Loading = props => {
  return (
    <View style={Styles.centered}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default Loading;
