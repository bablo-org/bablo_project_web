import { Currencies } from "../../mockeddata/Currencies";

const getCurrencyById = (id) => {
  return new Promise((resolve, reject) => {
    const currency = Currencies.find(currency => currency.id === id)
    if (currency) {
      resolve(currency);
    } else {
      reject("Currency not found");
    }
  });
};

export default getCurrencyById;
