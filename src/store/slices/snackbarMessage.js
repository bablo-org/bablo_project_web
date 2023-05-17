/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  severity: '',
  message: '',
};

const snackbarMessageSlice = createSlice({
  name: 'snackbarMessage',
  initialState,
  reducers: {
    showSavedSnackbarMessage(state) {
      state.open = true;
      state.severity = 'success';
      state.message = 'Изменения успешно сохранены';
    },
    showPostedSnackbarMessage(state) {
      state.open = true;
      state.severity = 'success';
      state.message = 'Транзакция успешно добавлена';
    },
    showErrorSnackbarMessage(state) {
      state.open = true;
      state.severity = 'error';
      state.message =
        'Что-то пошло не так... Попробуйте перезагрузить страницу.';
    },
    closeSnackbarMessage(state) {
      state.open = false;
      state.severity = '';
      state.message = '';
    },
  },
});

const { actions, reducer } = snackbarMessageSlice;

export default reducer;

export const {
  showSavedSnackbarMessage,
  showPostedSnackbarMessage,
  showErrorSnackbarMessage,
  closeSnackbarMessage,
} = actions;
