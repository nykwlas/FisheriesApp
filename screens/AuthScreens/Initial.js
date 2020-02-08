import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';

import * as authActions from '../../store/actions/auth';

// let bootSplashLogo = require('../../assets/logo.png');

// let fakeApiCallWithoutBadNetwork = ms =>
//   new Promise(resolve => setTimeout(resolve, ms));

const Initial = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        // const data = await fakeApiCallWithoutBadNetwork(2000);
        props.navigation.navigate('Auth');
        return;
      }
      const transformedData = JSON.parse(userData);
      const {token, userId, expiryDate} = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        // const data = await fakeApiCallWithoutBadNetwork(2000);
        props.navigation.navigate('Auth');
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();
      // const data = await fakeApiCallWithoutBadNetwork(2000);
      props.navigation.navigate('App');
      dispatch(authActions.authenticate(userId, token, expirationTime));
    };

    tryLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Initial;
