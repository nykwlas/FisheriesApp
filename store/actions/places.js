import * as FileSystem from 'react-native-fs';

import {insertPlace, fetchPlaces} from '../../helpers/db';
import googleApiKey from '../../config/GoogleMaps/googleMapsAPI';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

export const addPlace = (title, image, location) => {
  return async dispatch => {
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
    //     location.lat
    //   },${location.lng}&key=${googleApiKey}`,
    // );

    // if (!response.ok) {
    //   throw new Error('Something went wrong!');
    // }

    // const resData = await response.json();
    // if (!resData.results) {
    //   throw new Error('Something went wrong!');
    // }

    // const address = resData.results[0].formatted_address;
    var RNFS = require('react-native-fs');
    const fileName = image.split('/').pop();
    var path = RNFS.DocumentDirectoryPath + fileName;
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      // await FileSystem.moveAsync({
      //   from: image,
      //   to: newPath,
      // });
      RNFS.writeFile(path, 'My Places', 'utf8')
        .then(success => {
          console.log('FILE WRITTEN!');
        })
        .catch(err => {
          console.log(err.message);
        });
      const dbResult = await insertPlace(
        title,
        newPath,
        // address,
        location.lat,
        location.lng,
      );
      console.log(dbResult);
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          // address: address,
          coords: {
            lat: location.lat,
            lng: location.lng,
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      // console.log(dbResult);
      if (dbResult.rows.length !== 0) {
        dispatch({type: SET_PLACES, places: dbResult.rows._array});
      }
    } catch (err) {
      throw err;
    }
  };
};
