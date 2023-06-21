import { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useGetCurrencies } from '../../../../queries';
import { groupCurrencies } from '../../../../utils/groupCurrencies';
import { auth } from '../../../../services/firebase';
import Currency from '../../../../models/Currency';
import User from '../../../../models/User';

const currentUserId = auth?.currentUser?.uid;

interface GroupedCurrency extends Currency {
  group: string;
}

const defaulConvertertValue = {
  group: '',
  id: '',
  name: '',
  rate: 0,
  symbol: '',
  updated: 0,
};

function CurrencyAutocomplete({ users }: { users: User[] | undefined }) {
  const { data: currencies, isFetching: loadingCurrencies } =
    useGetCurrencies();
  const [enteredCurrency, setEnteredCurrency] =
    useState<GroupedCurrency | null>(defaulConvertertValue);
  const [currenciesOptions, setCurrenciesOptions] = useState<GroupedCurrency[]>(
    [],
  );
  const currentUser = useMemo(
    () => users?.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );
  useEffect(() => {
    if (!currentUser || !currencies) {
      return;
    }
    const options = groupCurrencies(currencies, currentUser);
    options.unshift(defaulConvertertValue);

    setCurrenciesOptions(options);
  }, [currentUser, currencies]);
  return (
    <Autocomplete
      id='currencyAuto'
      value={enteredCurrency}
      options={currenciesOptions}
      onChange={(event, newValue) => {
        setEnteredCurrency(newValue);
      }}
      loading={loadingCurrencies}
      loadingText='Загрузка...'
      noOptionsText='Ничего не найдено'
      groupBy={(option) => option.group}
      getOptionLabel={(option) => {
        if (option.name === '') {
          return option.name;
        }
        const currencyName = `${option.id} - ${option.name}`;
        return currencyName;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Фильтр валют'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loadingCurrencies ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default CurrencyAutocomplete;
