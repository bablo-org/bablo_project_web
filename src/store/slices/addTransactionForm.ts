/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
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

export interface ItemDescriptions {
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

export interface BillItem {
  description: string | undefined;
  sum: string | undefined;
  isSumValid: boolean;
  selectedUsers: User[];
  isSelectUsersRequired: boolean;
  id: string;
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
  isBillModeOn: boolean;
  billitemsList: BillItem[];
  isAddPerItemDescription: boolean;
  perItemDescription: ItemDescriptions;
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
  isBillModeOn: true,
  billitemsList: [
    {
      description: '',
      sum: '',
      isSumValid: true,
      selectedUsers: [],
      isSelectUsersRequired: true,
      id: nanoid(),
    },
  ],
  isAddPerItemDescription: false,
  perItemDescription: {},
};

const shareBillItemsSumAtSender = (
  sender: string[],
  billitemsList: BillItem[],
) => {
  const updatedEnteredUsersSum: UsersSum = {};
  sender.forEach((userId) => {
    let totalSum = 0;
    billitemsList.forEach((billItem) => {
      if (billItem.selectedUsers.map((user) => user.id).includes(userId)) {
        const sum = billItem.sum ?? 0;
        totalSum += roundSum(+sum, billItem.selectedUsers.length);
      }
    });
    updatedEnteredUsersSum[userId] = roundSum(totalSum, 1).toString();
  });
  return updatedEnteredUsersSum;
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
      state.sumRemainsError = {};
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
    clearForm: (state) => {
      return {
        ...initialState,
        currenciesOptions: state.currenciesOptions,
        isBillModeOn: state.isBillModeOn,
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
    addBillItem(state) {
      state.billitemsList.push({
        description: '',
        sum: '',
        isSumValid: true,
        selectedUsers: [],
        isSelectUsersRequired: true,
        id: nanoid(),
      });
    },
    removeBillItem(state, action: PayloadAction<string>) {
      state.billitemsList = state.billitemsList.filter(
        (item) => item.id !== action.payload,
      );
    },
    setBillItemDescription(
      state,
      action: PayloadAction<{ description: string; index: number }>,
    ) {
      const { description, index } = action.payload;
      state.billitemsList[index].description = description;
    },
    validateAndSetBillItemSum(
      state,
      action: PayloadAction<{ inputValue: string; index: number }>,
    ) {
      const { inputValue, index } = action.payload;
      const sum = replaceComma(inputValue);

      state.billitemsList[index].isSumValid = true;

      if (!isSumValid(sum)) {
        state.billitemsList[index].isSumValid = false;
      }
      if (!validationProps.sum.testSumInput(sum) && sum !== '') {
        return state;
      }

      state.billitemsList[index].sum = sum;
      state.enteredUsersSum = shareBillItemsSumAtSender(
        state.sender,
        state.billitemsList,
      );
      return state;
    },
    setBillItemSelectedUsers(
      state,
      action: PayloadAction<{
        users: User[];
        index: number;
        currentUserId: string | undefined;
      }>,
    ) {
      const { users, index, currentUserId } = action.payload;
      state.billitemsList[index].selectedUsers = users;
      state.billitemsList[index].isSelectUsersRequired = true;
      const isUsersIncludeCurrentUser = users.some(
        (user) => user.id === currentUserId,
      );

      if (
        (!isUsersIncludeCurrentUser && users.length > 0) ||
        (isUsersIncludeCurrentUser && users.length > 1)
      ) {
        state.billitemsList[index].isSelectUsersRequired = false;
      }

      state.enteredUsersSum = shareBillItemsSumAtSender(
        state.sender,
        state.billitemsList,
      );
    },
    generatePerItemDescription(state) {
      state.sender.forEach((userId) => {
        let description = `Всего - ${state.enteredUsersSum[userId]},\nв том числе:\n`;
        let count = 1;

        state.billitemsList.forEach((billItem, index) => {
          billItem.selectedUsers.forEach((selectedUser) => {
            if (selectedUser.id === userId && billItem.sum) {
              const itemSum = roundSum(
                +billItem.sum,
                billItem.selectedUsers.length,
              ).toString();

              const itemName = billItem.description
                ? billItem.description
                : `Позиция ${index + 1}`;
              description = description.concat(
                `${count}. ${itemName} - ${itemSum}\n`,
              );
              count += 1;
            }
          });
        });
        state.perItemDescription[userId] = description;
      });
    },
    toggleIsAddPerItemDescription(state) {
      state.isAddPerItemDescription = !state.isAddPerItemDescription;
    },
    toogleIsBillСalculation(state) {
      state.isBillModeOn = !state.isBillModeOn;
    },
    recalculateSumOnModeSwitched(state) {
      if (state.isBillModeOn) {
        state.enteredUsersSum = shareBillItemsSumAtSender(
          state.sender,
          state.billitemsList,
        );
      }
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
  addBillItem,
  removeBillItem,
  setBillItemDescription,
  validateAndSetBillItemSum,
  setBillItemSelectedUsers,
  generatePerItemDescription,
  toggleIsAddPerItemDescription,
  toogleIsBillСalculation,
  recalculateSumOnModeSwitched,
} = actions;
