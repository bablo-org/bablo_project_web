/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userName: '',
  tgUserName: '',
  showTgCollapse: false,
  selectedCurrencies: [],
  showCurrenciesCollapse: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setTgName(state, action) {
      state.tgUserName = action.payload;
    },
    toggleTgCollapse(state) {
      state.showTgCollapse = !state.showTgCollapse;
    },
    setCurrencies(state, action) {
      state.selectedCurrencies = action.payload;
    },
    toggleCurrenciesCollapse(state) {
      state.showCurrenciesCollapse = !state.showCurrenciesCollapse;
    },
  },
});

export default profileSlice.reducer;
export const profileActions = profileSlice.actions;
