import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import snackbarMessage from './slices/snackbarMessage';
import addTransaction from './slices/addTransaction';

const store = configureStore({
  reducer: { auth: authReducer, snackbarMessage, addTransaction },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
