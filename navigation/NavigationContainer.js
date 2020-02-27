import React, {useEffect, useRef} from 'react';

import {NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import AppContainer from '.';

const NavigationContainer = props => {
  const navRef = useRef();

  useEffect(() => {
    const userData = AsyncStorage.getItem('userData').then(() => {
      if (!userData) {
        navRef.current.dispatch(
          NavigationActions.navigate({routeName: 'Auth'}),
        );
      }
    });
  }, []);

  return <AppContainer ref={navRef} />;
};

export default NavigationContainer;
