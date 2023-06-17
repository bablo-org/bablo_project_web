/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  user: FirebaseUser | null;
}

interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<FirebaseUser>) {
      state.user = action.payload;
    },
    verifyEmail(state) {
      if (state.user) {
        state.user.emailVerified = true;
      }
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

const { actions, reducer } = authSlice;
export default reducer;

export const { setUser, clearUser, verifyEmail } = actions;
