import React, {useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import RNBootSplash from 'react-native-bootsplash';

import NavigationContainer from './navigation/NavigationContainer';
import authReducer from './store/reducers/auth';
import recordsReducer from './store/reducers/records';

const rootReducer = combineReducers({
  records: recordsReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

// let fakeApiCallWithoutBadNetwork = ms =>
//   new Promise(resolve => setTimeout(resolve, ms));

export default function App() {
  const init = async () => {
    // const waiting = await fakeApiCallWithoutBadNetwork(1500);
  };

  useEffect(() => {
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
