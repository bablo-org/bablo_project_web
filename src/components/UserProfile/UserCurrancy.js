import {
  Grid,
  Autocomplete,
  TextField,
  Stack,
  Button,
  Typography,
  Chip,
  Divider,
  Tooltip,
  Collapse,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Check as CheckIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from '@mui/icons-material';
import { useState, useMemo, useEffect } from 'react';
import { useGetCurrencies, useUpdateUserSettings } from '../../queries';

function UserCurrancy({ currentUser, setOpenSuccessModal, setOpenErrorModal }) {
  const [selectedCurrencies, setSelectedCurrencis] = useState([]);
  const [favoriteCurrenciesId, setFavoriteCurrenciesId] = useState([]);
  const [isCurrenciesUpdated, setIsCurrenciesUpdated] = useState(false);
  const [addCurrienseOff, setAddCurrienseOff] = useState(false);
  const { data: currencies } = useGetCurrencies();
  const { mutateAsync: putUserSettings, isLoading: loadingSetSettings } =
    useUpdateUserSettings();

  const favoriteCurrencies = useMemo(() => {
    if (favoriteCurrenciesId && currencies.length > 1)
      return favoriteCurrenciesId.map((item) => {
        return currencies.find((e) => e.id === item);
      });
    return undefined;
  }, [favoriteCurrenciesId, currencies]);

  const removeFavoriteCurrencis = (currencyId) => {
    const updatedCurrencies = favoriteCurrenciesId.filter(
      (id) => currencyId.indexOf(id) === -1,
    );
    setFavoriteCurrenciesId(updatedCurrencies);
    setIsCurrenciesUpdated(true);
  };

  const renderFavoriteCurrenciesList = () => {
    if (favoriteCurrencies && favoriteCurrenciesId.length > 0) {
      return favoriteCurrencies.map((item) => {
        const symbol = item.symbol ? item.symbol : '¤';
        return (
          <Tooltip title={item.name} key={item.name}>
            <Chip
              label={
                <Stack direction='row' spacing={1}>
                  <div style={{ fontWeight: 'bold' }}>{symbol}</div>
                  <div>{item.id}</div>
                </Stack>
              }
              key={item.id}
              variant='outlined'
              color='primary'
              onDelete={() => removeFavoriteCurrencis([item.id])}
              sx={{ width: '100px' }}
            />
          </Tooltip>
        );
      });
    }
    return <Typography variant='body1'>Нет избранных валют</Typography>;
  };

  const updateUserSettings = async (updatedCurrencies) => {
    try {
      const settings = { favoriteCurrencies: updatedCurrencies };
      await putUserSettings(settings);
      setOpenSuccessModal(true);
    } catch {
      setOpenErrorModal(true);
    } finally {
      // setConfirmModalOpen(false);
    }
  };

  const addNewCurrencies = (e) => {
    e.preventDefault();
    const newCurrenciesId = selectedCurrencies.map((obj) => obj.id);
    const settings = favoriteCurrenciesId.concat(newCurrenciesId);
    updateUserSettings(settings);
  };

  useEffect(() => {
    setFavoriteCurrenciesId(currentUser.favoriteCurrencies);
  }, [currentUser]);

  const favoriteCurrenciesList = renderFavoriteCurrenciesList();
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateUserSettings(favoriteCurrenciesId);
        }}
      >
        <Grid
          container
          spacing={2}
          direction='column'
          sx={{ textAlign: 'left', marginTop: '5px' }}
        >
          <Grid item xs={12}>
            <Stack
              direction='row'
              spacing={2}
              sx={{
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'left' },
              }}
              useFlexGap
              flexWrap='wrap'
            >
              {favoriteCurrenciesList}
            </Stack>
          </Grid>
          {isCurrenciesUpdated && (
            <Grid item xs={12}>
              <Stack direction='row' spacing={2}>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setFavoriteCurrenciesId(currentUser.favoriteCurrencies);
                    setIsCurrenciesUpdated(false);
                  }}
                  color='error'
                  endIcon={<ClearIcon />}
                >
                  Отмена
                </Button>
                <LoadingButton
                  loading={loadingSetSettings}
                  variant='contained'
                  color='success'
                  type='submit'
                  endIcon={<CheckIcon />}
                >
                  Сохранить
                </LoadingButton>
              </Stack>
            </Grid>
          )}
        </Grid>
      </form>
      <Grid
        container
        spacing={2}
        direction='column'
        sx={{ textAlign: 'left', marginTop: '5px' }}
      >
        {favoriteCurrenciesId.length > 0 && (
          <Grid item xs={12}>
            <Stack
              direction='row'
              spacing={2}
              sx={{ alignItems: 'center' }}
              divider={<Divider orientation='vertical' flexItem />}
            >
              <Typography variant='body1' sx={{ width: '200px' }}>
                Удалить все
              </Typography>
              <Button
                color='error'
                onClick={() => {
                  removeFavoriteCurrencis(favoriteCurrenciesId);
                }}
              >
                <DeleteIcon color='error' />
              </Button>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack
            direction='row'
            spacing={2}
            sx={{ alignItems: 'center' }}
            divider={<Divider orientation='vertical' flexItem />}
          >
            <Typography variant='body1' sx={{ width: '200px' }}>
              Добавить
            </Typography>
            <Button
              color='success'
              onClick={() => {
                setAddCurrienseOff(!addCurrienseOff);
              }}
            >
              <AddCircleOutlineIcon color='success' />
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Collapse in={addCurrienseOff}>
        <form onSubmit={addNewCurrencies}>
          <Grid
            container
            spacing={2}
            direction='column'
            sx={{ textAlign: 'left', marginTop: '5px' }}
          >
            <Grid item xs={12}>
              <Autocomplete
                multiple
                value={selectedCurrencies}
                onChange={(event, newValue) => {
                  setSelectedCurrencis(newValue);
                }}
                id='currencis'
                options={currencies.filter((obj) => {
                  return favoriteCurrenciesId.indexOf(obj.id) === -1;
                })}
                getOptionLabel={(option) => {
                  const currencyName = `${option.id} - ${option.name}`;
                  return currencyName;
                }}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Валюта'
                    helperText='Выберите одну или несколько валют'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction='row' spacing={2}>
                <Button
                  variant='outlined'
                  onClick={() => setSelectedCurrencis([])}
                  color='error'
                  endIcon={<ClearIcon />}
                >
                  Очистить
                </Button>
                <LoadingButton
                  loading={loadingSetSettings}
                  variant='contained'
                  color='success'
                  type='submit'
                  endIcon={<CheckIcon />}
                >
                  Добавить
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Collapse>
    </>
  );
}

export default UserCurrancy;
