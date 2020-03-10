import {AUTHENTICATE, LOGOUT, PROFILE} from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  displayName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
      };
    case PROFILE:
      return {
        ...state,
        displayName: action.displayName,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
