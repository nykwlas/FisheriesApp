import {
  DELETE_ROOM,
  CREATE_ROOM,
  SET_ROOMS,
  PUSH_MESSAGE,
  SET_MESSAGES,
} from '../actions/messaging';
import Room from '../../models/room';
import Message from '../../models/message';

const initialState = {
  availableRooms: [],
  messages: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOMS:
      return {
        ...state,
        availableRooms: action.rooms,
      };
    case CREATE_ROOM:
      const newRoom = new Room(action.recordData.id, action.recordData.name);
      return {
        ...state,
        availableRooms: state.availableRooms.concat(newRoom),
      };
    case DELETE_ROOM:
      return {
        ...state,
        availableRooms: state.availableRooms.filter(
          room => room.id !== action.room,
        ),
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case PUSH_MESSAGE:
      const newMessage = new Message(
        action.recordData.id,
        action.recordData.text,
        action.recordData.createdAt,
        {_id: action.recordData.userId, name: action.recordData.userName},
      );
      return {
        ...state,
        message: state.messages.concat(newMessage),
      };
  }
  return state;
};
