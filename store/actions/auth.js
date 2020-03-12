import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from 'firebase/app';
import 'firebase/storage';

export const AUTHENTICATE = 'AUTHENTICATE';
export const PROFILE = 'PROFILE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({type: AUTHENTICATE, userId: userId, token: token});
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBEbKwUIcUAjhIDaOQzxX5Tqm_jTGI7FJY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong with signup!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      } else if (errorId === 'INVALID_EMAIL') {
        message = 'This email is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn, 10) * 1000,
      ),
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn, 10) * 1000,
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const updateProfileName = name => {
  return async dispatch => {
    const userData = await AsyncStorage.getItem('userData');
    const transformedData = JSON.parse(userData);
    const {token} = transformedData;
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBEbKwUIcUAjhIDaOQzxX5Tqm_jTGI7FJY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
          displayName: name,
          returnSecureToken: false,
        }),
      },
    );

    if (!response.ok) {
      let message = 'Something went wrong storing user data!';
      throw new Error(message);
    }
  };
};

export const updatePhotoUrl = photoUrl => {
  return async dispatch => {
    const userData = await AsyncStorage.getItem('userData');
    const transformedData = JSON.parse(userData);
    const {token} = transformedData;
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBEbKwUIcUAjhIDaOQzxX5Tqm_jTGI7FJY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
          photoUrl: photoUrl,
          returnSecureToken: false,
        }),
      },
    );

    if (!response.ok) {
      let message = 'Something went wrong storing user data!';
      throw new Error(message);
    }
  };
};

export const getProfile = () => {
  return async dispatch => {
    const userData = await AsyncStorage.getItem('userData');
    const transformedData = JSON.parse(userData);
    const {token} = transformedData;
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBEbKwUIcUAjhIDaOQzxX5Tqm_jTGI7FJY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
        }),
      },
    );

    if (!response.ok) {
      let message = 'Something went wrong with user data!';
      throw new Error(message);
    }

    const resData = await response.json();
    // console.log(resData.users[0].photoUrl);
    dispatch({
      type: PROFILE,
      displayName: resData.users[0].displayName,
      photoUrl: resData.users[0].photoUrl,
      email: resData.users[0].email,
    });
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBEbKwUIcUAjhIDaOQzxX5Tqm_jTGI7FJY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      },
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn, 10) * 1000,
      ),
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn, 10) * 1000,
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const resetPassword = email => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBEbKwUIcUAjhIDaOQzxX5Tqm_jTGI7FJY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email,
        }),
      },
    );

    if (!response.ok) {
      let message = 'Something went wrong reseting password!';
      throw new Error(message);
    }
    // const resData = await response.json();
  };
};

export const deleteAccount = () => {
  return async dispatch => {
    const userData = await AsyncStorage.getItem('userData');
    const transformedData = JSON.parse(userData);
    const {token} = transformedData;
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBEbKwUIcUAjhIDaOQzxX5Tqm_jTGI7FJY',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
        }),
      },
    );

    if (!response.ok) {
      let message = 'Something went wrong deleting account!';
      throw new Error(message);
    }
    // const resData = await response.json();
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return {type: LOGOUT};
};

export const handleUpload = source => {
  return async dispatch => {
    const userData = await AsyncStorage.getItem('userData');
    const transformedData = JSON.parse(userData);
    const {userId} = transformedData;
    const blob = await uriToBlob(source);
    const url =
      'https://firebasestorage.googleapis.com/v0/b/shopapp-d5c17.appspot.com/o/ProfileImages%2F' +
      userId +
      '.jpg?alt=media';
    try {
      const snapshot = await uploadToFirebase(blob, userId);
      console.log('File uploaded');
      // updatePhotoUrl(url); //&token=33ad29d0-d56d-4e24-a988-d7a1acbc9463
      // getProfile();
    } catch (error) {
      console.log(error);
      throw error;
    }
    // console.log(url);
  };
};

const uriToBlob = uri => {
  return new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function() {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };

    // this helps us get a blob
    xhr.responseType = 'blob';

    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};

const uploadToFirebase = (blob, userId) => {
  return new Promise(async (resolve, reject) => {
    var storageRef = firebase.storage().ref();

    storageRef
      .child('ProfileImages/' + userId + '.jpg')
      .put(blob, {
        contentType: 'image/jpeg',
      })
      .then(snapshot => {
        blob.close();

        resolve(snapshot);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    }),
  );
};
