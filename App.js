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

export default function App() {
  let init = async () => {
    // …do multiple async tasks
  };

  useEffect(() => {
    init().finally(() => {
      // without fadeout: RNBootSplash.hide()
      RNBootSplash.hide({duration: 250});
    });
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
