import {
  TextField,
  FormControl,
  Stack,
  Button,
  Grid,
  Collapse,
} from '@mui/material';
import {
  SafetyDivider as SafetyDividerIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { validationProps } from '../../../utils/validationForm';
import classes from '../DebtForm.module.css';
import User from '../../../models/User';
import {
  setIsMyselfIncluded,
  validateAndSetUsersSum,
  setEnteredUsersSumOnBlur,
} from '../../../store/slices/addTransactionForm';
import { choseSumTextHelper, isAllManual } from '../Utils';
import { showSnackbarMessage } from '../../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../../models/enums/SnackbarSeverity';

interface GroupTransactionProps {
  users: User[] | undefined;
  shareSumHandler: () => void;
}
function GroupTransaction({ users, shareSumHandler }: GroupTransactionProps) {
  const {
    sender,
    enteredUsersSum,
    isEnteredUsersSumValid,
    sumRemainsError,
    isMyselfIncluded,
    manualInputs,
    enteredSum,
  } = useAppSelector((state) => state.addTransactionForm);
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.user?.uid);
  const currentUser = users?.find((item) => item.id === currentUserId);

  const toogleIsMyselfInclude = () => {
    dispatch(setIsMyselfIncluded());
  };

  const usersSumInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    user: User | undefined,
  ) => {
    const inputValue = event.target.value;
    dispatch(validateAndSetUsersSum({ inputValue, user, currentUserId }));
  };

  const usersSumInputBlurHandler = (userId: string) => {
    dispatch(setEnteredUsersSumOnBlur(userId));
  };

  const showInputError = useMemo(() => {
    return (id: string) => {
      return sumRemainsError[id] || !(isEnteredUsersSumValid[id] ?? true);
    };
  }, [sumRemainsError, isEnteredUsersSumValid]);

  useEffect(() => {
    let amount = sender.length;
    if (isMyselfIncluded) {
      amount += 1;
    }
    if (isAllManual(manualInputs, amount)) {
      dispatch(
        showSnackbarMessage({
          severity: SnackbarSeverity.WARNING,
          message: 'Общая сумма транзакции изменилась',
        }),
      );
    }
  }, [enteredSum, manualInputs]);
  return (
    <>
      <Grid item xs={12}>
        <Stack
          direction={window.innerWidth < 820 ? 'column' : 'row'}
          spacing={2}
        >
          <Button
            variant={isMyselfIncluded ? 'contained' : 'outlined'}
            endIcon={<PersonIcon />}
            onClick={toogleIsMyselfInclude}
            sx={{ width: { md: '200px' } }}
          >
            {isMyselfIncluded ? 'Исключить меня' : 'Включить меня'}
          </Button>
          <Button
            variant='outlined'
            onClick={shareSumHandler}
            endIcon={<SafetyDividerIcon />}
          >
            Поделить поровну
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Collapse in={isMyselfIncluded}>
          {isMyselfIncluded && currentUserId && (
            <FormControl fullWidth required>
              <TextField
                variant='outlined'
                label='Моя сумма'
                value={enteredUsersSum[currentUserId] || ''}
                onChange={(event) => {
                  usersSumInputChangeHandler(event, currentUser);
                }}
                onBlur={() => usersSumInputBlurHandler(currentUserId)}
                type='text'
                id='myselfSum'
                inputProps={{
                  inputMode: 'numeric',
                  pattern: validationProps.sum.inputPropsPattern,
                  title: validationProps.sum.errorTitle,
                }}
                helperText={choseSumTextHelper(
                  sumRemainsError,
                  isEnteredUsersSumValid[currentUserId] ?? true,
                  currentUserId,
                )}
                error={showInputError(currentUserId)}
                style={{ whiteSpace: 'pre-wrap' }}
                className={
                  enteredUsersSum[currentUserId] ? classes.valid : undefined
                }
              />
            </FormControl>
          )}
        </Collapse>
      </Grid>
      {sender.map((id) => {
        const user = users?.find((item) => item.id === id);
        if (!user) {
          return null;
        }
        return (
          <Grid item xs={12} key={id}>
            <FormControl fullWidth required>
              <TextField
                variant='outlined'
                label={`Сумма ${user.name}`}
                value={enteredUsersSum[user.id] || ''}
                type='text'
                id={`sum ${user.id}`}
                onChange={(event) => {
                  usersSumInputChangeHandler(event, user);
                }}
                onBlur={() => usersSumInputBlurHandler(user.id)}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: validationProps.sum.inputPropsPattern,
                  title: validationProps.sum.errorTitle,
                }}
                helperText={choseSumTextHelper(
                  sumRemainsError,
                  isEnteredUsersSumValid[user.id] ?? true,
                  user.id,
                )}
                error={showInputError(user.id)}
                style={{ whiteSpace: 'pre-wrap' }}
                className={enteredUsersSum[user.id] ? classes.valid : undefined}
                required
              />
            </FormControl>
          </Grid>
        );
      })}
    </>
  );
}
export default GroupTransaction;
