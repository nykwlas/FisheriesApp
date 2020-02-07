import {
  DELETE_RECORD,
  CREATE_RECORD,
  UPDATE_RECORD,
  SET_RECORD,
} from '../actions/records';
import Record from '../../models/record';

const initialState = {
  availableRecords: [],
  userRecords: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_RECORD:
      return {
        availableRecords: action.records,
        userRecords: action.userRecords,
      };
    case CREATE_RECORD:
      const newRecord = new Record(
        action.recordData.id,
        action.recordData.ownerId,
        action.recordData.title,
        action.recordData.imageUrl,
        action.recordData.description,
        action.recordData.date,
      );
      return {
        ...state,
        availableRecords: state.availableRecords.concat(newRecord),
        userRecords: state.userRecords.concat(newRecord),
      };
    case UPDATE_RECORD:
      const recordIndex = state.userRecords.findIndex(
        prod => prod.id === action.pid,
      );
      const updatedProduct = new Record(
        action.pid,
        state.userRecords[recordIndex].ownerId,
        action.recordData.title,
        action.recordData.imageUrl,
        action.recordData.description,
        state.userRecords[recordIndex].date,
      );
      const updatedUserRecords = [...state.userRecords];
      updatedUserRecords[recordIndex] = updatedProduct;
      const availableRecordIndex = state.availableRecords.findIndex(
        prod => prod.id === action.pid,
      );
      const updatedAvailableRecords = [...state.availableRecords];
      updatedAvailableRecords[availableRecordIndex] = updatedProduct;
      return {
        ...state,
        availableRecords: updatedAvailableRecords,
        userRecords: updatedUserRecords,
      };
    case DELETE_RECORD:
      return {
        ...state,
        userRecords: state.userRecords.filter(
          record => record.id !== action.pid,
        ),
        availableRecords: state.availableRecords.filter(
          record => record.id !== action.pid,
        ),
      };
  }
  return state;
};
