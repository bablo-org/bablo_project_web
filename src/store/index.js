import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import snackbarMessage from './slices/snackbarMessage';

const store = configureStore({
  reducer: { auth: authReducer, snackbarMessage },
  devTools: process.env.NODE_ENV !== 'production',
});

export const authActions = authReducer.actions;
export default store;
