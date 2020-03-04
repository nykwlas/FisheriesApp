import Record from '../../models/record';
import Catch from '../../models/catch';

export const DELETE_RECORD = 'DELETE_RECORD';
export const CREATE_RECORD = 'CREATE_RECORD';
export const UPDATE_RECORD = 'UPDATE_RECORD';
export const SET_RECORD = 'SET_RECORD';

export const fetchRecords = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://shopapp-d5c17.firebaseio.com/records.json?auth=${token}`,
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedRecords = [];
      for (const key in resData) {
        const catches = [];
        for (const key2 in resData[key].catches) {
          catches.push(
            new Catch(
              key,
              resData[key].catches[key2].kind,
              resData[key].catches[key2].weight,
              resData[key].catches[key2].length,
              resData[key].catches[key2].time,
              resData[key].catches[key2].depth,
              resData[key].catches[key2].method,
            ),
          );
        }
        loadedRecords.push(
          new Record(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].date,
            catches,
          ),
        );
      }

      dispatch({
        type: SET_RECORD,
        records: loadedRecords,
        userRecords: loadedRecords.filter(prod => prod.ownerId === userId),
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteRecord = recordId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopapp-d5c17.firebaseio.com/records/${recordId}.json?auth=${token}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({type: DELETE_RECORD, pid: recordId});
  };
};

export const createRecord = (title, description, imageUrl, date, catches) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://shopapp-d5c17.firebaseio.com/records.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          date,
          catches,
          ownerId: userId,
        }),
      },
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_RECORD,
      recordData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        date,
        catches,
        ownerId: userId,
      },
    });
  };
};

export const updateRecord = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shopapp-d5c17.firebaseio.com/records/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_RECORD,
      pid: id,
      recordData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
