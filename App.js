import React from 'react';
import AppContainer from './navigation';
import Firebase, {FirebaseProvider} from './config/Firebase';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';

import storiesReducer from './store/reducers/stories';

const rootReducer = combineReducers({
  stories: storiesReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <FirebaseProvider value={Firebase}>
        <AppContainer />
      </FirebaseProvider>
    </Provider>
  );
}
