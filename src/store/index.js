import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';

const store = configureStore({
  reducer: { auth: authReducer },
});

export const authActions = authReducer.actions;
export default store;
