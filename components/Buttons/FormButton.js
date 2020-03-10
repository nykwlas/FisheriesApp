import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';

const FormButton = ({title, buttonType, buttonColor, ...rest}) => (
  <Button
    {...rest}
    type={buttonType}
    title={title}
    buttonStyle={(styles.button, {borderColor: buttonColor})}
    titleStyle={{color: buttonColor}}
  />
);

const styles = StyleSheet.create({
  button: {borderRadius: 20},
});

export default FormButton;
