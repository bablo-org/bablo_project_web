import { useQuery } from '@tanstack/react-query';
import Currency from '../models/Currency';

const useGetCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    placeholderData: [],
    select: (data: any) => {
      return data.map((currency: any) => ({
        id: currency.id,
        name: currency.name,
        rate: currency.rate,
        updated: currency.updated,
        symbol: currency.symbol,
      })) as Currency[];
    },
  });
};

export { useGetCurrencies };
