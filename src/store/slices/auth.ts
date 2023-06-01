/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: FireBaseUser | null;
}

interface FireBaseUser {
  uid: string;
  email: string;
}

const initialState: AuthState = {
  user: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<FireBaseUser>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

const { actions, reducer } = authSlice;
export default reducer;

export const { setUser, clearUser } = actions;
