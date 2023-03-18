import { Currencies } from "../../mockeddata/Currencies";

const getCurrencies = () => {
  return new Promise((resolve, _) => {
    resolve(Currencies);
  });
};

export default getCurrencies;
