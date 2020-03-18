import {ADD_PLACE, SET_PLACES, DELETE_PLACES} from '../actions/places';
import Place from '../../models/place';

const initialState = {
  places: [],
  userPlaces: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      return {
        places: action.places,
        userPlaces: action.userPlaces,
      };
    case ADD_PLACE:
      const newPlace = new Place(
        action.placeData.id,
        action.placeData.title,
        action.placeData.image,
        // action.placeData.address,
        action.placeData.coords.lat,
        action.placeData.coords.lng,
        action.placeData.ownerId,
      );
      return {
        ...state,
        places: state.places.concat(newPlace),
        userPlaces: state.userPlaces.concat(newPlace),
      };
    case DELETE_PLACES:
      return {
        ...state,
        places: state.places.filter(place => place.id !== action.pid),
        userPlaces: state.userPlaces.filter(place => place.id !== action.pid),
      };
    default:
      return state;
  }
};
