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
import TransitionsModal from '../modal/modal';
import { useGetCurrencies, useUpdateUserSettings } from '../../queries';

function UserCurrancy({ currentUser, setSnackbarType }) {
  const [selectedCurrencies, setSelectedCurrencis] = useState([]);
  const [favoriteCurrenciesId, setFavoriteCurrenciesId] = useState([]);
  const [isCurrenciesUpdated, setIsCurrenciesUpdated] = useState(false);
  const [addCurrienseOff, setAddCurrienseOff] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
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
        const { symbol } = item;
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
      setSnackbarType('success');
    } catch {
      setSnackbarType('error');
    } finally {
      setConfirmModalOpen(false);
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

  return (
    <>
      <TransitionsModal
        isOpen={confirmModalOpen}
        title='Вы уверены?'
        handleClose={() => {
          setConfirmModalOpen(false);
        }}
        body={
          <Stack
            direction='row'
            spacing={2}
            sx={{ alignItems: 'center', marginTop: '10px' }}
          >
            <LoadingButton
              loading={loadingSetSettings}
              variant='contained'
              color='success'
              type='submit'
              endIcon={<CheckIcon />}
              onClick={() => updateUserSettings(favoriteCurrenciesId)}
            >
              Да
            </LoadingButton>
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                setConfirmModalOpen(false);
              }}
              endIcon={<ClearIcon />}
            >
              Нет
            </Button>
          </Stack>
        }
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setConfirmModalOpen(true);
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
              {renderFavoriteCurrenciesList()}
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
                  disabled={selectedCurrencies.length < 1}
                >
                  Очистить
                </Button>
                <LoadingButton
                  loading={loadingSetSettings}
                  variant='contained'
                  color='success'
                  type='submit'
                  endIcon={<CheckIcon />}
                  disabled={selectedCurrencies.length < 1}
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
