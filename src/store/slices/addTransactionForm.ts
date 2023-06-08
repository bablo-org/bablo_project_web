/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Currency from '../../models/Currency';
import User from '../../models/User';
import { validationProps } from '../../utils/validationForm';
import {
  isSumValid,
  replaceComma,
  isAllManual,
  roundSum,
} from '../../components/DebtForm/Utils';

export interface UsersSum {
  [key: string]: string;
}

interface GroupedCurrency extends Currency {
  group: string;
}

export interface SumError {
  [key: string]: boolean;
}

interface UsersSumInput {
  inputValue: string | undefined;
  user: User | undefined;
  currentUserId: string | undefined;
}

interface AddTransactionForm {
  sender: string[];
  disabledSender: string[];
  receiver: string[];
  disabledReceiver: string[];
  enteredCurrency: GroupedCurrency | null;
  enteredSum: string | undefined;
  isEnteredSumValid: boolean;
  enteredUsersSum: UsersSum;
  isEnteredUsersSumValid: SumError;
  enteredDescription: string;
  enteredDate: number | undefined;
  currenciesOptions: GroupedCurrency[];
  sumRemainsError: SumError;
  manualInputs: string[];
  isMyselfIncluded: boolean;
}

const initialState: AddTransactionForm = {
  sender: [],
  disabledSender: [],
  receiver: [],
  disabledReceiver: [],
  enteredCurrency: null,
  enteredSum: undefined,
  isEnteredSumValid: true,
  enteredUsersSum: {},
  isEnteredUsersSumValid: {},
  enteredDescription: '',
  enteredDate: undefined,
  currenciesOptions: [],
  sumRemainsError: {},
  manualInputs: [],
  isMyselfIncluded: false,
};

const addTransactionForm = createSlice({
  name: 'addTransactionForm',
  initialState,
  reducers: {
    clearAllSumErrors(
      state,
      action: PayloadAction<{ clearManualInputs: boolean }>,
    ) {
      state.sumRemainsError = {};
      state.isEnteredUsersSumValid = {};
      if (action.payload.clearManualInputs) {
        state.manualInputs = [];
      }
    },
    validateAndSetUsersSum(state, action: PayloadAction<UsersSumInput>) {
      const { user, currentUserId } = action.payload;
      if (!user) {
        return state;
      }
      const newManualInputs = [...state.manualInputs];

      // define input fields of enteredUsersSum
      const sumInputs = [...state.sender];
      if (state.isMyselfIncluded) {
        sumInputs.push(currentUserId!);
      }

      // repclace comma at entered value
      const inputValue = replaceComma(action.payload.inputValue!);

      // clear inputErrors
      state.sumRemainsError = {
        ...state.sumRemainsError,
        [user.id]: false,
      };
      state.isEnteredUsersSumValid = {
        ...state.isEnteredUsersSumValid,
        [user.id]: true,
      };

      // add input field to manual inputs
      if (!state.manualInputs.includes(user.id) && state.enteredSum) {
        newManualInputs.push(user.id);
        state.manualInputs = [...state.manualInputs, user.id];
      }

      // validation entered data
      if (!isSumValid(inputValue)) {
        // replace current input field from manual inputs
        state.isEnteredUsersSumValid[user.id] = false;
        state.manualInputs = state.manualInputs.filter((id) => id !== user.id);
      }
      if (!validationProps.sum.testSumInput(inputValue) && inputValue !== '') {
        return state;
      }

      // validation controll sum
      if (
        state.enteredSum &&
        +inputValue > +state.enteredSum &&
        !isAllManual(newManualInputs, sumInputs.length)
      ) {
        state.sumRemainsError[user.id] = true;
        state.enteredUsersSum[user.id] = inputValue;
        return state;
      }

      if (state.enteredSum) {
        // set sumRemains witout input value
        let sumRemains = +state.enteredSum - +inputValue;

        // set sumRemains without values at manual inputs
        state.manualInputs.forEach((id) => {
          if (id in state.enteredUsersSum && id !== user.id) {
            sumRemains -= +state.enteredUsersSum[id];
          }
        });

        // case if all inputs as manual
        // set total sum as amount of inputs and alert User
        if (isAllManual(newManualInputs, sumInputs.length)) {
          let sum = +inputValue;
          state.manualInputs.forEach((id) => {
            if (id in state.enteredUsersSum && id !== user.id) {
              sum += +state.enteredUsersSum[id];
            }
          });
          state.enteredSum = sum.toString();
          state.enteredUsersSum[user.id] = inputValue;
          return state;
        }

        // validation controll sum and sumRemains spread at not manual inputs
        if (isSumValid(roundSum(sumRemains, 1).toString())) {
          sumInputs.forEach((itemId) => {
            if (itemId !== user.id && !state.manualInputs.includes(itemId)) {
              const amount = sumInputs.length - newManualInputs.length;
              state.enteredUsersSum[itemId] = roundSum(
                sumRemains,
                amount,
              ).toString();
              state.isEnteredUsersSumValid[itemId] = true;
            }
          });
          state.enteredUsersSum[user.id] = inputValue;
        }
      } else {
        state.enteredUsersSum[user.id] = inputValue;
      }
      return state;
    },
    validateAndSetEnteredSum(state, action: PayloadAction<string>) {
      const inputValue = replaceComma(action.payload);
      state.isEnteredSumValid = true;

      if (!isSumValid(inputValue)) {
        state.isEnteredSumValid = false;
      }
      if (!validationProps.sum.testSumInput(inputValue) && inputValue !== '') {
        return state;
      }

      state.enteredSum = inputValue;
      state.enteredUsersSum = {};
      state.sumRemainsError = {};
      state.isEnteredUsersSumValid = {};
      state.manualInputs = [];
      return state;
    },
    clearForm: () => {
      return {
        ...initialState,
      };
    },
    setSelectedUsers(
      state,
      action: PayloadAction<
        Pick<
          AddTransactionForm,
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
    setEnteredDescription(state, action: PayloadAction<string>) {
      state.enteredDescription = action.payload;
    },
    setEnteredDate(state, action: PayloadAction<number | undefined>) {
      state.enteredDate = action.payload;
    },
    setCurrenciesOptions(state, action: PayloadAction<GroupedCurrency[]>) {
      state.currenciesOptions = action.payload;
    },
    setIsMyselfIncluded(state) {
      if (state.isMyselfIncluded) {
        state.enteredUsersSum = {};
        state.sumRemainsError = {};
        state.isEnteredUsersSumValid = {};
      }
      state.isMyselfIncluded = !state.isMyselfIncluded;
    },
    setEnteredUsersSumOnBlur(state, action: PayloadAction<string>) {
      const userId = action.payload;
      Object.keys(state.enteredUsersSum).forEach((id) => {
        if (state.enteredUsersSum[id] === '0') {
          delete state.enteredUsersSum[id];
        }
      });
      if (
        !state.isEnteredUsersSumValid[userId] &&
        isSumValid(state.enteredUsersSum[userId])
      ) {
        state.isEnteredUsersSumValid[userId] = true;
      }
    },
    setEnteredSumOnBlur(state) {
      if (!state.isEnteredSumValid && isSumValid(state.enteredSum ?? '')) {
        state.isEnteredSumValid = true;
      }
      if (state.enteredSum === '0') {
        state.enteredSum = undefined;
      }
    },
    shareSum(state) {
      let amount = state.sender.length;
      if (state.isMyselfIncluded) {
        amount += 1;
      }

      const sharedSum = state.enteredSum ? +state.enteredSum : 0;
      state.sender.forEach((id) => {
        state.enteredUsersSum[id] = roundSum(sharedSum, amount).toString();
      });

      state.sumRemainsError = {};
      state.isEnteredUsersSumValid = {};
      state.manualInputs = [];
    },
  },
});

const { actions, reducer } = addTransactionForm;

export default reducer;

export const {
  validateAndSetUsersSum,
  clearAllSumErrors,
  clearForm,
  setSelectedUsers,
  setEnteredCurrency,
  setEnteredDescription,
  setEnteredDate,
  setCurrenciesOptions,
  setIsMyselfIncluded,
  setEnteredUsersSumOnBlur,
  validateAndSetEnteredSum,
  setEnteredSumOnBlur,
  shareSum,
} = actions;
