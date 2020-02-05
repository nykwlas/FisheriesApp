import React, {createContext} from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

const FirebaseContext = createContext({});

export const FirebaseProvider = FirebaseContext.Provider;

export const FirebaseConsumer = FirebaseContext.Consumer;

// export const withFirebaseHOC = Component => props => (
//   <FirebaseConsumer>
//     {state => <Component {...props} firebase={state} />}
//   </FirebaseConsumer>
// );

export const withFirebaseHOC = Component => {
  const Wrapper = props => {
    return (
      <FirebaseConsumer>
        {state => <Component {...props} firebase={state} />}
      </FirebaseConsumer>
    );
  };
  hoistNonReactStatics(Wrapper, Component);
  return Wrapper;
};
