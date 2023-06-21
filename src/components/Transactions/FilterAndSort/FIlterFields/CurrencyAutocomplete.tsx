import { useState, useMemo } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useGetCurrencies } from '../../../../queries';
import { groupCurrencies } from '../../../../utils/groupCurrencies';
import { auth } from '../../../../services/firebase';
import Currency from '../../../../models/Currency';
import User from '../../../../models/User';

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

function CurrencyAutocomplete({
  users,
  onChange,
}: {
  users: User[] | undefined;
  onChange: (currency: string | null) => void;
}) {
  const currentUserId = auth?.currentUser?.uid;
  const { data: currencies, isFetching: loadingCurrencies } =
    useGetCurrencies();
  const [enteredCurrency, setEnteredCurrency] =
    useState<GroupedCurrency | null>(defaulConvertertValue);

  const currentUser = useMemo(
    () => users?.find((u) => u.id === currentUserId),
    [users, currentUserId],
  );

  const currenciesOptions = useMemo(() => {
    if (!currentUser || !currencies) {
      return [];
    }

    const options = groupCurrencies(currencies, currentUser);
    return options;
  }, [currentUser, currencies]);

  return (
    <Autocomplete
      id='currencyAuto'
      value={enteredCurrency}
      options={currenciesOptions}
      onChange={(event, newValue) => {
        setEnteredCurrency(newValue);
        onChange(newValue?.id || null);
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
