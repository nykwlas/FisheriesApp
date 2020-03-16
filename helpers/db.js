import {openDatabase} from 'react-native-sqlite-storage';
import {Alert} from 'react-native';

// SQLite.DEBUG(true);
// SQLite.enablePromise(true);
var db = openDatabase({name: 'places.db'});
// const db = SQLite.openDatabase({name: 'places.db'});

export const init = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);',
        [],
        (tx, results) => {
          resolve(results);
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const insertPlace = (title, imageUri, lat, lng) => {
  //, address
  const promise = new Promise((resolve, reject) => {
    db.transaction(function(txn) {
      txn.executeSql(
        'INSERT INTO places (title, imageUri, lat, lng) VALUES (?, ?, ?, ?);',
        [title, imageUri, lat, lng],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Registration Failed');
          }
          resolve(results);
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};

export const fetchPlaces = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM places',
        [],
        (tx, results) => {
          console.log(results);
          resolve(results);
        },
        (_, err) => {
          reject(err);
        },
      );
    });
  });
  return promise;
};
