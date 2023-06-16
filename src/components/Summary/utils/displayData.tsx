import { nanoid } from '@reduxjs/toolkit';
import { formatNumber, isRoundingToZero } from '../../../utils/NumberUtils';

export const displayTotalIncomeData = (totalSummaryData: {
  [key: string]: number;
}) => {
  const totalOutput = Object.entries(totalSummaryData)
    .filter((e) => !isRoundingToZero(e[1])) // skip zeros
    .map((e) => `${e[0]}: ${formatNumber(e[1])}`); // {'USD', 123456.789} => 'USD: 123 456,79'
  return totalOutput.length > 0 ? totalOutput : ['-/-'];
};

export function printArr(arr: string[]) {
  return arr.map((val) => <p key={nanoid()}>{val}</p>);
}
