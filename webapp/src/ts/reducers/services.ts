import { Actions } from "../actions/services";
import { createReducer, on } from '@ngrx/store';

const initialState = {
  lastChangedDoc: false
};

const _servicesReducer = createReducer(
  initialState,
  on(Actions.setLastChangedDoc, (state, { payload: { lastChangedDoc } }) => {
    return Object.assign({}, state, {
      lastChangedDoc: Object.assign({}, { lastChangedDoc })
    });
  })
);

export function servicesReducer(state, action) {
  return _servicesReducer(state, action);
}


/*
const actionTypes = require('../actions/actionTypes');


module.exports = function(state, action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
  case actionTypes.SET_LAST_CHANGED_DOC:
    return Object.assign({}, state, { lastChangedDoc: action.payload.lastChangedDoc });
  default:
    return state;
  }
};
*/
