import React from 'react';
import {StyleSheet} from 'react-native';
import {Image} from 'react-native-elements';

const AppLogo = () => (
  <Image source={require('../assets/flame.png')} style={styles.logo} />
);

const styles = StyleSheet.create({
  logo: {width: 200, height: 200},
});

export default AppLogo;
