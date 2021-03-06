import React, {useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';

import NavigationContainer from './navigation/NavigationContainer';

import authReducer from './store/reducers/auth';
import recordsReducer from './store/reducers/records';
import weatherReducer from './store/reducers/weather';
import placesReducer from './store/reducers/places';
import messagingReducer from './store/reducers/messaging';

import firebaseConfig from './config/Firebase/firebaseConfig';
import * as firebase from 'firebase/app';
import 'firebase/storage';

const rootReducer = combineReducers({
  records: recordsReducer,
  auth: authReducer,
  weather: weatherReducer,
  places: placesReducer,
  messaging: messagingReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

// let fakeApiCallWithoutBadNetwork = ms =>
//   new Promise(resolve => setTimeout(resolve, ms));

export default function App() {
  const init = async () => {
    // const waiting = await fakeApiCallWithoutBadNetwork(1500);
  };

  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    init().finally(() => {
      RNBootSplash.hide({duration: 250});
    });
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
