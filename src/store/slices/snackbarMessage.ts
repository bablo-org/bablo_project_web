/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SnackbarSeverity } from '../../models/enums/snackbarSeverity';

interface SnackbarState {
  open: boolean;
  severity: SnackbarSeverity | undefined;
  message: string | undefined;
}

const initialState: SnackbarState = {
  open: false,
  severity: undefined,
  message: '',
};

const snackbarMessageSlice = createSlice({
  name: 'snackbarMessage',
  initialState,
  reducers: {
    showSnackbarMessage(state, action: PayloadAction<Partial<SnackbarState>>) {
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
