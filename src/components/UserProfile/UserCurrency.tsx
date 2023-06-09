/* eslint-disable import/no-duplicates */
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
import { useState, useMemo, useEffect, FormEvent, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import TransitionsModal from '../modal/modal';
import { useGetCurrencies, useUpdateUserSettings } from '../../queries';
import { showSnackbarMessage } from '../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../models/enums/SnackbarSeverity';
import CurrenciesSkeleton from './Skeleton/CurrenciesSkeleton';
import Currency from '../../models/Currency';
import User from '../../models/User';
import { UserSettings } from '../../models/User';
import { profileActions } from '../../store/slices/profileForm';

interface Props {
  currentUser: User;
}

function UserCurrency({ currentUser }: Props) {
  const [favoriteCurrenciesId, setFavoriteCurrenciesId] = useState<string[]>(
    [],
  );
  const [isCurrenciesUpdated, setIsCurrenciesUpdated] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { data: currencies, isFetching: currenciesLoading } =
    useGetCurrencies();
  const { mutateAsync: putUserSettings, isLoading: loadingSetSettings } =
    useUpdateUserSettings();
  const dispatch = useAppDispatch();
  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedCurrencies = useAppSelector(
    (state) => state.profileForm.selectedCurrencies,
  );
  const showTgCollapse = useAppSelector(
    (state) => state.profileForm.showCurrenciesCollapse,
  );
  const favoriteCurrencies = useMemo(() => {
    if (favoriteCurrenciesId && !currenciesLoading)
      return favoriteCurrenciesId.map((item) => {
        return currencies?.find((e) => e.id === item);
      });
    return undefined;
  }, [favoriteCurrenciesId, currencies, currenciesLoading]);

  const removeFavoriteCurrencies = (currencyId: string[]) => {
    const updatedCurrencies = favoriteCurrenciesId.filter(
      (id) => currencyId.indexOf(id) === -1,
    );
    setFavoriteCurrenciesId(updatedCurrencies);
    setIsCurrenciesUpdated(true);
  };

  const executeScroll = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderFavoriteCurrenciesList = () => {
    if (favoriteCurrencies && favoriteCurrenciesId.length > 0) {
      return favoriteCurrencies.map((item) => {
        const { symbol }: { symbol: string } = item!;
        return (
          <Tooltip title={item?.name} key={item?.name}>
            <Chip
              label={
                <Stack direction='row' spacing={1}>
                  <div style={{ fontWeight: 'bold' }}>{symbol}</div>
                  <div>{item?.id}</div>
                </Stack>
              }
              key={item?.id}
              variant='outlined'
              color='primary'
              onDelete={() => removeFavoriteCurrencies([item?.id!])}
              sx={{ width: '100px' }}
            />
          </Tooltip>
        );
      });
    }
    return <Typography variant='body1'>Нет избранных валют</Typography>;
  };

  const updateUserSettings = async (updatedCurrencies: string[]) => {
    try {
      const settings: UserSettings = { favoriteCurrencies: updatedCurrencies };
      await putUserSettings(settings);
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.SUCCESS,
          message: 'Изменения успешно сохранены',
        }),
      );
    } catch {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.ERROR,
          message: 'Что-то пошло не так... Попробуйте перезагрузить страницу.',
        }),
      );
    } finally {
      dispatch(profileActions.setCurrencies([]));
      setConfirmModalOpen(false);
      setIsCurrenciesUpdated(false);
    }
  };

  const addNewCurrencies = (e: FormEvent) => {
    e.preventDefault();
    const newCurrenciesId = selectedCurrencies.map((obj: Currency) => obj.id);
    const settings: string[] = favoriteCurrenciesId.concat(newCurrenciesId);
    updateUserSettings(settings);
  };

  const showSkeleton = useMemo(
    () => currenciesLoading || !currentUser,
    [currenciesLoading, currentUser],
  );

  useEffect(() => {
    if (currentUser) {
      setFavoriteCurrenciesId(
        currentUser.privateData?.settings?.favoriteCurrencies!,
      );
    }
  }, [currentUser]);

  return showSkeleton ? (
    <CurrenciesSkeleton />
  ) : (
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
        icon={undefined}
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
                    setFavoriteCurrenciesId(
                      currentUser.privateData?.settings?.favoriteCurrencies!,
                    );
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
                  removeFavoriteCurrencies(favoriteCurrenciesId);
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
                dispatch(profileActions.toggleCurrenciesCollapse());
              }}
            >
              <AddCircleOutlineIcon color='success' />
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Collapse in={showTgCollapse} onEntered={executeScroll}>
        <form onSubmit={addNewCurrencies}>
          <Grid
            container
            spacing={2}
            direction='column'
            sx={{ textAlign: 'left', marginTop: '5px' }}
            ref={bottomRef}
          >
            <Grid item xs={12}>
              <Autocomplete
                multiple
                value={selectedCurrencies}
                onChange={(event, newValue) => {
                  dispatch(profileActions.setCurrencies(newValue));
                }}
                id='currencis'
                options={
                  currencies?.filter((obj) => {
                    return favoriteCurrenciesId.indexOf(obj.id) === -1;
                  }) ?? []
                }
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
                  onClick={() => dispatch(profileActions.setCurrencies([]))}
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

export default UserCurrency;
