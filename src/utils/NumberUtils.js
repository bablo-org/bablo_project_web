export const defaultRoundingDigits = 2;

// 1234567.085 -> 1 234 567,09
export const formatNumber = (number) => {
  return number.toLocaleString('ru-RU', {
    maximumFractionDigits: defaultRoundingDigits,
  });
};

export const isRoundingToZero = (number) => {
  return number.toFixed(defaultRoundingDigits) === '0.00';
};
