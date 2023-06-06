/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Currency from '../../models/Currency';

export interface UsersSum {
  [key: string]: string;
}

interface GroupedCurrency extends Currency {
  group: string;
}

export interface SumError {
  [key: string]: boolean;
}

interface AddTransaction {
  sender: string[];
  disabledSender: string[];
  receiver: string[];
  disabledReceiver: string[];
  enteredCurrency: GroupedCurrency | null;
  enteredSum: string | undefined;
  isEnteredSumValid: boolean;
  totalSum: number;
  enteredUsersSum: UsersSum;
  isEnteredUsersSumValid: SumError;
  enteredDescription: string;
  enteredDate: number | undefined;
  currenciesOptions: GroupedCurrency[];
  sumRemainsError: SumError;
  sumError: SumError;
  manualInputs: string[];
  isMyselfIncluded: boolean;
  myselfSum: string | undefined;
}

const initialState: AddTransaction = {
  sender: [],
  disabledSender: [],
  receiver: [],
  disabledReceiver: [],
  enteredCurrency: null,
  enteredSum: undefined,
  isEnteredSumValid: true,
  totalSum: 0,
  enteredUsersSum: {},
  isEnteredUsersSumValid: {},
  enteredDescription: '',
  enteredDate: undefined,
  currenciesOptions: [],
  sumRemainsError: {},
  sumError: {},
  manualInputs: [],
  isMyselfIncluded: false,
  myselfSum: undefined,
};

const addTransaction = createSlice({
  name: 'addTransaction',
  initialState,
  reducers: {
    clearAllSumErrors(
      state,
      action: PayloadAction<{ clearManualInputs: boolean }>,
    ) {
      state.sumError = {};
      state.sumRemainsError = {};
      state.isEnteredUsersSumValid = {};
      if (action.payload.clearManualInputs) {
        state.manualInputs = [];
      }
    },
    clearForm: (state) => {
      return {
        ...initialState,
        sender: state.sender,
        disabledSender: state.disabledSender,
        receiver: state.receiver,
        disabledReceiver: state.disabledReceiver,
        currenciesOptions: state.currenciesOptions,
      };
    },
    setSelectedUsers(
      state,
      action: PayloadAction<
        Pick<
          AddTransaction,
          'sender' | 'receiver' | 'disabledSender' | 'disabledReceiver'
        >
      >,
    ) {
      state.sender = action.payload.sender;
      state.receiver = action.payload.receiver;
      state.disabledSender = action.payload.disabledSender;
      state.disabledReceiver = action.payload.disabledReceiver;
    },
    setEnteredCurrency(state, action: PayloadAction<GroupedCurrency | null>) {
      state.enteredCurrency = action.payload;
    },
    setEnteredSum(state, action: PayloadAction<string | undefined>) {
      state.enteredSum = action.payload;
    },
    setIsEnteredSumValid(state, action: PayloadAction<boolean>) {
      state.isEnteredSumValid = action.payload;
    },
    setTotalSum(state, action: PayloadAction<number>) {
      state.totalSum = action.payload;
    },
    setEnteredUsersSum(state, action: PayloadAction<UsersSum>) {
      state.enteredUsersSum = action.payload;
    },
    setIsEnteredUsersSumValid(state, action: PayloadAction<SumError>) {
      state.isEnteredUsersSumValid = action.payload;
    },
    setEnteredDescription(state, action: PayloadAction<string>) {
      state.enteredDescription = action.payload;
    },
    setEnteredDate(state, action: PayloadAction<number | undefined>) {
      state.enteredDate = action.payload;
    },
    setCurrenciesOptions(state, action: PayloadAction<GroupedCurrency[]>) {
      state.currenciesOptions = action.payload;
    },
    setSumRemainsError(state, action: PayloadAction<SumError>) {
      state.sumRemainsError = action.payload;
    },
    setSumError(state, action: PayloadAction<SumError>) {
      state.sumError = action.payload;
    },
    setManualInputs(state, action: PayloadAction<string[]>) {
      state.manualInputs = action.payload;
    },
    setIsMyselfIncluded(state, action: PayloadAction<boolean>) {
      state.isMyselfIncluded = action.payload;
    },
    setMyselfSum(state, action: PayloadAction<string | undefined>) {
      state.myselfSum = action.payload;
    },
  },
});

const { actions, reducer } = addTransaction;

export default reducer;

export const {
  clearAllSumErrors,
  clearForm,
  setSelectedUsers,
  setEnteredCurrency,
  setEnteredSum,
  setIsEnteredSumValid,
  setTotalSum,
  setEnteredUsersSum,
  setIsEnteredUsersSumValid,
  setEnteredDescription,
  setEnteredDate,
  setCurrenciesOptions,
  setSumRemainsError,
  setSumError,
  setManualInputs,
  setIsMyselfIncluded,
  setMyselfSum,
} = actions;
