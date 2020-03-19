import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';
import * as authActions from '../../store/actions/auth';
import Loading from '../../components/Loading';

const Initial = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        props.navigation.navigate('Auth');
        return;
      }
      const transformedData = JSON.parse(userData);
      const {token, userId, expiryDate} = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate('Auth');
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();
      props.navigation.navigate('App');
      dispatch(authActions.authenticate(userId, token, expirationTime));
      await dispatch(authActions.getProfile());
    };

    tryLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return <Loading />;
};

export default Initial;
