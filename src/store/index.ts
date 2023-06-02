import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import snackbarMessage from './slices/snackbarMessage';
import profileForm from './slices/profileForm';

const store = configureStore({
  reducer: { auth: authReducer, snackbarMessage, profileForm },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
