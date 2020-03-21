import Room from '../../models/room';
import Message from '../../models/message';

export const DELETE_ROOM = 'DELETE_ROOM';
export const CREATE_ROOM = 'CREATE_ROOM';
export const SET_ROOMS = 'SET_ROOMS';

export const SET_MESSAGES = 'SET_MESSAGES';
export const PUSH_MESSAGE = 'PUSH_MESSAGE';

export const fetchRooms = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const url = `https://shopapp-d5c17.firebaseio.com/rooms.json?auth=${token}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      // console.log(resData);
      const loadedRooms = [];
      // eslint-disable-next-line no-unused-vars
      for (const key in resData) {
        loadedRooms.push(new Room(key, resData[key].name));
      }

      dispatch({
        type: SET_ROOMS,
        rooms: loadedRooms,
      });
    } catch (err) {
      // send to custom analytics server
      console.log(err);
      throw err;
    }
  };
};

export const deleteRoom = roomId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopapp-d5c17.firebaseio.com/rooms/${roomId}.json?auth=${token}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({type: DELETE_ROOM, room: roomId});
  };
};

export const createRoom = name => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopapp-d5c17.firebaseio.com/rooms.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json();
    dispatch({
      type: CREATE_ROOM,
      recordData: {
        id: resData.name,
        name: name,
      },
    });
  };
};

export const fetchMessages = roomKey => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const url = `https://shopapp-d5c17.firebaseio.com/messages/${roomKey}.json?auth=${token}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();
      const loadedMessages = [];
      // eslint-disable-next-line no-unused-vars
      for (const key in resData) {
        loadedMessages.push(
          new Message(key, resData[key].text, resData[key].createdAt, {
            _id: resData[key].user._id,
            name: resData[key].user.name,
          }),
        );
      }

      dispatch({
        type: SET_MESSAGES,
        messages: loadedMessages,
      });
    } catch (err) {
      // send to custom analytics server
      console.log(err);
      throw err;
    }
  };
};

export const pushMessage = (roomKey, text, createdAt, _id, name) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopapp-d5c17.firebaseio.com/messages/${roomKey}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          createdAt,
          user: {
            _id: _id,
            name: name,
          },
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json();
    dispatch({
      type: PUSH_MESSAGE,
      recordData: {
        id: resData.name,
        text: text,
        createdAt: createdAt,
        userId: _id,
        userName: name,
      },
    });
  };
};
