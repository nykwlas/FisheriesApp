import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const FormInput = ({
  iconName,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  ...rest
}) => (
  <View style={styles.inputContainer}>
    <Input
      {...rest}
      leftIcon={<Icon name={iconName} size={28} color={iconColor} />}
      leftIconContainerStyle={styles.iconStyle}
      placeholderTextColor="grey"
      name={name}
      placeholder={placeholder}
      inputStyle={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
  },
  inputContainer: {
    margin: 10,
    marginHorizontal: 20,
  },
  iconStyle: {
    // marginRight: 10,
  },
});

export default FormInput;
