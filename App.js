import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';

import NavigationContainer from './navigation/NavigationContainer';
import authReducer from './store/reducers/auth';
import recordsReducer from './store/reducers/records';

const rootReducer = combineReducers({
  records: recordsReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
