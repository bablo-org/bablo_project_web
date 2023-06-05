/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Currency from '../../models/Currency';

interface InitialState {
  userName: string;
  tgUserName: string;
  showTgCollapse: boolean;
  selectedCurrencies: Currency[];
  showCurrenciesCollapse: boolean;
}

const initialState: InitialState = {
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
    setCurrencies(state, action: PayloadAction<Currency[]>) {
      state.selectedCurrencies = action.payload;
    },
    toggleCurrenciesCollapse(state) {
      state.showCurrenciesCollapse = !state.showCurrenciesCollapse;
    },
  },
});

export default profileSlice.reducer;
export const profileActions = profileSlice.actions;
