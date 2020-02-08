import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';

import * as authActions from '../../store/actions/auth';
// import Colors from '../../constants/Colors';

let bootSplashLogo = require('../../assets/logo.png');

let fakeApiCallWithoutBadNetwork = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

const Initial = props => {
  const dispatch = useDispatch();

  let init = async () => {
    RNBootSplash.hide();
  };

  useEffect(() => {
    init().finally(() => {
      // without fadeout: RNBootSplash.hide()
      RNBootSplash.hide({duration: 250});
    });
  }, []);

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        const data = await fakeApiCallWithoutBadNetwork(3000);
        props.navigation.navigate('Auth');
        return;
      }
      const transformedData = JSON.parse(userData);
      const {token, userId, expiryDate} = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        const data = await fakeApiCallWithoutBadNetwork(3000);
        props.navigation.navigate('Auth');
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();
      const data = await fakeApiCallWithoutBadNetwork(3000);
      props.navigation.navigate('App');
      dispatch(authActions.authenticate(userId, token, expirationTime));
    };

    tryLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Fisher.</Text>
      <Image
        style={styles.logo}
        source={bootSplashLogo} //{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    margin: 20,
    lineHeight: 30,
    color: '#333',
    textAlign: 'center',
  },
  bootsplash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    height: 250,
    width: 250,
  },
});

export default Initial;
