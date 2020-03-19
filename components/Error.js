import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-elements';

import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

const Error = props => {
  return (
    <View style={Styles.centered}>
      <Text>An error occurred!</Text>
      <Button
        title="Try again"
        onPress={props.onRetry}
        color={Colors.primary}
      />
    </View>
  );
};

export default Error;
