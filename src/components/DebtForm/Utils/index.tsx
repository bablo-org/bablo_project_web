import { validationProps } from '../../../utils/validationForm';
import { SumError } from '../../../store/slices/addTransaction';

export const replaceComma = (value: string) => {
  return value.replace(/,/g, '.');
};

export const isSumValid = (sum: string) => {
  return validationProps.sum.testSum(sum);
};

export const isAllManual = (inputs: string[], senderLength: number) => {
  return inputs.length === senderLength;
};

export const roundSum = (sum: number, amount: number) => {
  return Math.round((sum / amount) * 100) / 100;
};

export const choseSumTextHelper = (
  sumRemainsError: SumError,
  sumError: SumError,
  isEnteredSumValid?: boolean,
  userId?: string,
) => {
  if (userId && sumRemainsError[userId]) {
    return validationProps.sum.errorRemainsTitle;
  }
  if (!isEnteredSumValid) {
    return validationProps.sum.errorTitle;
  }
  if (userId && sumError[userId]) {
    return validationProps.sum.errorRemainsSumTitle;
  }
  return validationProps.sum.title;
};
