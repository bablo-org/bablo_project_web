/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  severity: undefined,
  message: '',
};

const snackbarMessageSlice = createSlice({
  name: 'snackbarMessage',
  initialState,
  reducers: {
    showSnackbarMessage(state, action) {
      state.open = true;
      state.severity = action.payload.severity;
      state.message = action.payload.message;
    },
    closeSnackbarMessage(state) {
      state.open = false;
    },
  },
});

const { actions, reducer } = snackbarMessageSlice;

export default reducer;

export const { showSnackbarMessage, closeSnackbarMessage } = actions;
