import {
  Grid,
  FormControl,
  TextField,
  Button,
  Autocomplete,
  Avatar,
  Stack,
  Typography,
  AvatarGroup,
  Tooltip,
  Switch,
  Divider,
} from '@mui/material';
import { Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  addBillItem,
  removeBillItem,
  setBillItemDescription,
  validateAndSetBillItemSum,
  setBillItemSelectedUsers,
  toggleIsAddPerItemDescription,
  generatePerItemDescription,
  setSelectedUsers,
  recalculateSumOnModeSwitched,
} from '../../../store/slices/addTransactionForm';
import User from '../../../models/User';
import { choseUsersId } from '../SelectUser/choseUsersId';

interface ItemListProps {
  users: User[] | undefined;
  currentUserId: string | undefined;
}

function ItemsList({ users, currentUserId }: ItemListProps) {
  const {
    billitemsList,
    isAddPerItemDescription,
    enteredDescription,
    isBillModeOn,
  } = useAppSelector((state) => state.addTransactionForm);
  const [isSelectFieldFocused, setIsSelectFieldFocused] = useState<{
    [key: number]: boolean;
  }>({});
  const dispatch = useAppDispatch();

  const autocompleteFocusHandler = (index: number) => {
    const obj = { ...isSelectFieldFocused };
    obj[index] = true;
    setIsSelectFieldFocused(obj);
  };

  const selectAndChooseSenderIds = (
    newValue: User[],
    index: number | undefined,
  ) => {
    const inputValue = newValue
      .filter((user) => user.id !== currentUserId)
      .map((user) => user.id);

    const anotherInputsValue = billitemsList
      .filter((billItem) => {
        if (!index) {
          return billItem.id;
        }
        return billItem.id !== billitemsList[index].id;
      })
      .flatMap((billItem) => billItem.selectedUsers.flatMap((user) => user.id))
      .filter((id) => id !== currentUserId);
    const updatedSender = [...new Set([...inputValue, ...anotherInputsValue])];

    if (updatedSender.length === 0) {
      return;
    }

    const { newSender, newReceiver, newDisabledSender, newDisabledReceiver } =
      choseUsersId(
        {
          sender: updatedSender,
          receiver: [],
        },
        users,
        currentUserId,
      );

    dispatch(
      setSelectedUsers({
        sender: newSender,
        receiver: newReceiver,
        disabledSender: newDisabledSender,
        disabledReceiver: newDisabledReceiver,
      }),
    );
    dispatch(recalculateSumOnModeSwitched());
  };

  const changeSelectedUsersHandler = (newValue: User[], index: number) => {
    selectAndChooseSenderIds(newValue, index);

    dispatch(
      setBillItemSelectedUsers({
        users: newValue,
        index,
        currentUserId,
      }),
    );
  };

  const renderItemsListField = billitemsList.map((billItem, index) => (
    <Grid
      item
      xs={12}
      key={billItem.id}
      sx={{
        position: 'relative',
        display: 'flex',
      }}
    >
      <Button
        onClick={() => dispatch(removeBillItem(billItem.id))}
        style={{ position: 'absolute', left: '-56px', top: '28px' }}
        color='error'
      >
        <RemoveIcon />
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              value={billItem.description}
              variant='outlined'
              label={`Позиция ${index + 1}`}
              onChange={(event) => {
                dispatch(
                  setBillItemDescription({
                    description: event.target.value,
                    index,
                  }),
                );
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <TextField
              value={billItem.sum}
              variant='outlined'
              label='Сумма'
              required
              onChange={(event) => {
                dispatch(
                  validateAndSetBillItemSum({
                    inputValue: event.target.value,
                    index,
                  }),
                );
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            multiple
            disableCloseOnSelect
            value={billItem.selectedUsers}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderTags={
              isSelectFieldFocused[index]
                ? () => null
                : () => (
                    <AvatarGroup
                      max={5}
                      sx={{
                        '& .MuiAvatar-root': {
                          width: 24,
                          height: 24,
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                        },
                        '& .MuiAvatarGroup-avatar': {
                          fontSize: '1rem',
                        },
                        '& .MuiAutocomplete-input': {
                          minWidth: '0%',
                        },
                      }}
                    >
                      {billItem.selectedUsers.map((user) => (
                        <Tooltip title={user.name} key={user.id}>
                          <Avatar src={user.avatar} />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  )
            }
            onFocus={() => autocompleteFocusHandler(index)}
            onBlur={() => setIsSelectFieldFocused({})}
            onChange={(event, newValue) => {
              changeSelectedUsersHandler(newValue, index);
            }}
            options={users ?? []}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <li {...props}>
                <Stack
                  direction='row'
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
                  <Avatar src={option.avatar} sx={{ width: 24, height: 24 }} />
                  <Typography variant='body1'>{option.name}</Typography>
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                required={billItem.isSelectUsersRequired}
                label='Участник'
              />
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  ));

  useEffect(() => {
    if (isAddPerItemDescription) {
      dispatch(generatePerItemDescription());
    }
  }, [billitemsList, isAddPerItemDescription, enteredDescription]);

  useEffect(() => {
    if (isBillModeOn) {
      selectAndChooseSenderIds([], undefined);
    }
  }, [isBillModeOn]);

  return (
    <>
      {renderItemsListField}
      <Grid
        item
        xs={12}
        sx={{
          position: 'relative',
          display: 'flex',
        }}
      >
        <Button
          onClick={() => dispatch(addBillItem())}
          style={{ position: 'absolute', left: '-56px', top: '28px' }}
          color='success'
        >
          <AddIcon />
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <TextField
                disabled
                variant='outlined'
                label='Описание'
                helperText='Введите описание позиции'
              />
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <TextField
                disabled
                variant='outlined'
                label='Сумма'
                helperText='Введите сумму'
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <TextField
                disabled
                variant='outlined'
                label='Участник'
                helperText='Выберите одного или нескольких плательщиков'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction='row'
              spacing={2}
              sx={{ alignItems: 'center' }}
              divider={<Divider orientation='vertical' flexItem />}
            >
              <Typography variant='body1'>
                Сгенерировать описание по позициям
              </Typography>
              <Switch
                checked={isAddPerItemDescription}
                onChange={() => {
                  dispatch(toggleIsAddPerItemDescription());
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ItemsList;
