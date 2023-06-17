import Currency from '../models/Currency';
import User from '../models/User';

const popularCurrencies = ['USD', 'EUR'];

export const groupCurrencies = (currencies: Currency[], currentUser: User) => {
  return currencies
    .map((obj) => {
      if (
        currentUser.privateData?.settings?.favoriteCurrencies?.includes(obj.id)
      ) {
        return { ...obj, group: 'Избранные валюты' };
      }
      if (popularCurrencies.includes(obj.id)) {
        return { ...obj, group: 'Популярные валюты' };
      }
      return { ...obj, group: 'Остальные валюты' };
    })
    .sort((a, b) => {
      const groupOrder: { [key: string]: number } = {
        'Избранные валюты': 1,
        'Популярные валюты': 2,
        'Остальные валюты': 3,
      };
      return groupOrder[a.group] - groupOrder[b.group];
    });
};
