import React, {useEffect} from 'react';
// import {AsyncStorage} from 'react-native';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
// import {createLogger} from 'redux-logger';
// import {persistStore, persistReducer} from 'redux-persist';
// import {PersistGate} from 'redux-persist/integration/react';
import RNBootSplash from 'react-native-bootsplash';

import NavigationContainer from './navigation/NavigationContainer';
import authReducer from './store/reducers/auth';
import recordsReducer from './store/reducers/records';
import weatherReducer from './store/reducers/weather';
import firebaseConfig from './config/Firebase/firebaseConfig';
import * as firebase from 'firebase/app';
import 'firebase/storage';

const rootReducer = combineReducers({
  records: recordsReducer,
  auth: authReducer,
  weather: weatherReducer,
});

// const Logger = createLogger({
//   predicate: (getState, action) => __DEV__,
//   collapsed: true,
//   duration: true,
// });

// const persistConfig = {
//   key: 'root3',
//   storage: AsyncStorage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

// const persistor = persistStore(store);

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
