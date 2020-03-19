import Place from '../../models/place';
// import googleApiKey from '../../config/GoogleMaps/googleMapsAPI';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';
export const DELETE_PLACES = 'DELETE_PLACES';

export const addPlace = (title, image, location) => {
  return async (dispatch, getState) => {
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
    var path = RNFS.DocumentDirectoryPath + fileName + '.jpg';
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const lat = location.lat;
    const lng = location.lng;
    try {
      RNFS.moveFile(image, path)
        .then(success => {
          // console.log('FILE WRITTEN!');
        })
        .catch(err => {
          console.log(err.message);
        });
      const url = `https://shopapp-d5c17.firebaseio.com/places.json?auth=${token}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          path,
          lat,
          lng,
          ownerId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      dispatch({
        type: ADD_PLACE,
        placeData: {
          id: resData.name,
          title: title,
          image: path,
          // address: address,
          coords: {
            lat: lat,
            lng: lng,
          },
          ownerId: userId,
        },
      });
    } catch (err) {
      // send to custom analytics server
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const url = `https://shopapp-d5c17.firebaseio.com/places.json?auth=${token}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      const loadedPlaces = [];
      // eslint-disable-next-line no-unused-vars
      for (const key in resData) {
        loadedPlaces.push(
          new Place(
            key,
            resData[key].title,
            resData[key].path,
            resData[key].lat,
            resData[key].lng,
            resData[key].ownerId,
          ),
        );
      }
      dispatch({
        type: SET_PLACES,
        places: loadedPlaces,
        userPlaces: loadedPlaces.filter(prod => prod.ownerId === userId),
      });
    } catch (err) {
      // send to custom analytics server
      console.log(err);
      throw err;
    }
  };
};

export const deletePlace = placeId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopapp-d5c17.firebaseio.com/places/${placeId}.json?auth=${token}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({type: DELETE_PLACES, pid: placeId});
  };
};
