import { TextField, FormControl, Stack, Button, Grid } from '@mui/material';
import {
  SafetyDivider as SafetyDividerIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { validationProps } from '../../../utils/validationForm';
import classes from '../DebtForm.module.css';
import User from '../../../models/User';
import {
  clearAllSumErrors,
  setEnteredSum,
  setEnteredUsersSum,
  setIsEnteredUsersSumValid,
  setSumRemainsError,
  setSumError,
  setManualInputs,
  setIsMyselfIncluded,
  setMyselfSum,
} from '../../../store/slices/addTransaction';
import {
  isSumValid,
  isAllManual,
  roundSum,
  choseSumTextHelper,
  replaceComma,
} from '../Utils';
import { showSnackbarMessage } from '../../../store/slices/snackbarMessage';
import { SnackbarSeverity } from '../../../models/enums/SnackbarSeverity';

interface GroupTransactionProps {
  users: User[] | undefined;
  shareSum: () => void;
}
function GroupTransaction({ users, shareSum }: GroupTransactionProps) {
  const {
    sender,
    enteredSum,
    totalSum,
    enteredUsersSum,
    isEnteredUsersSumValid,
    sumRemainsError,
    sumError,
    manualInputs,
    isMyselfIncluded,
    myselfSum,
  } = useAppSelector((state) => state.addTransaction);
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.user?.uid);

  const toogleIsMyselfInclude = () => {
    if (isMyselfIncluded) {
      dispatch(setMyselfSum(undefined));
      dispatch(setEnteredUsersSum({}));
      dispatch(clearAllSumErrors({ clearManualInputs: false }));
    }
    dispatch(setIsMyselfIncluded(!isMyselfIncluded));
  };

  const myselfSumInputChangaHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEnteredUsersSum({});
    dispatch(clearAllSumErrors({ clearManualInputs: true }));

    const inputValue = replaceComma(event.target.value);
    const newIsEnteredUsersSumValid = { ...isEnteredUsersSumValid };
    newIsEnteredUsersSumValid[currentUserId!] = false;

    if (
      !isSumValid(inputValue) &&
      validationProps.sum.testSumInput(inputValue)
    ) {
      dispatch(setIsEnteredUsersSumValid(newIsEnteredUsersSumValid));
    } else if (
      !isSumValid(inputValue) &&
      !validationProps.sum.testSumInput(inputValue) &&
      inputValue !== ''
    ) {
      dispatch(setIsEnteredUsersSumValid(newIsEnteredUsersSumValid));
      return;
    }

    const newSumError = currentUserId ? { [currentUserId]: true } : {};
    if (+event.target.value >= (enteredSum ? +enteredSum : 0)) {
      dispatch(setSumRemainsError(newSumError));
    }
    dispatch(setMyselfSum(inputValue));
  };

  const usersSumInputChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    user: User | undefined,
  ) => {
    if (!user) {
      return;
    }
    dispatch(clearAllSumErrors({ clearManualInputs: false }));

    const newUsersSum = {
      ...enteredUsersSum,
    };
    const newSumError = { ...sumError };
    const newManualInputs = [...manualInputs];
    const newIsEnteredUsersSumValid = { ...isEnteredUsersSumValid };

    newUsersSum[user.id] = replaceComma(event.target.value);
    newSumError[user.id] = true;
    newIsEnteredUsersSumValid[user.id] = false;

    if (!manualInputs.includes(user.id) && enteredSum) {
      newManualInputs.push(user.id);
      dispatch(setManualInputs(newManualInputs));
    }

    if (
      !isSumValid(newUsersSum[user.id] ?? '') &&
      validationProps.sum.testSumInput(newUsersSum[user.id])
    ) {
      dispatch(setIsEnteredUsersSumValid(newIsEnteredUsersSumValid));
    }
    if (
      !isSumValid(newUsersSum[user.id] ?? '') &&
      !validationProps.sum.testSumInput(newUsersSum[user.id]) &&
      newUsersSum[user.id] !== ''
    ) {
      dispatch(setIsEnteredUsersSumValid(newIsEnteredUsersSumValid));
      return;
    }

    if (
      enteredSum &&
      +newUsersSum[user.id] > +enteredSum &&
      !isAllManual(newManualInputs, sender.length)
    ) {
      const newSumRemainsError = { ...sumRemainsError };
      newSumRemainsError[user.id] = true;
      dispatch(setSumRemainsError(newSumRemainsError));
      dispatch(setEnteredUsersSum(newUsersSum));
      return;
    }

    if (enteredSum) {
      let sumRemains = totalSum - +newUsersSum[user.id];

      manualInputs.forEach((id) => {
        if (id in enteredUsersSum && id !== user.id) {
          sumRemains -= +enteredUsersSum[id];
        }
      });

      if (isAllManual(newManualInputs, sender.length)) {
        let sum = +newUsersSum[user.id];
        manualInputs.forEach((id) => {
          if (id in enteredUsersSum && id !== user.id) {
            sum += +enteredUsersSum[id];
          }
        });
        dispatch(setEnteredSum(sum.toString()));
        dispatch(setMyselfSum(undefined));
        dispatch(
          showSnackbarMessage({
            severity: SnackbarSeverity.WARNING,
            message: 'Общая сумма транзакции изменилась',
          }),
        );
      }

      if (isSumValid(roundSum(sumRemains, 1).toString())) {
        sender.forEach((selectedUser) => {
          if (
            selectedUser !== user.id &&
            !manualInputs.includes(selectedUser)
          ) {
            const amount = sender.length - newManualInputs.length;
            newUsersSum[selectedUser] = roundSum(sumRemains, amount).toString();
          }
        });
      } else if (
        +sumRemains < 0 &&
        !isAllManual(newManualInputs, sender.length)
      ) {
        dispatch(setSumError(newSumError));
      }
      dispatch(setEnteredUsersSum(newUsersSum));
    } else {
      dispatch(setEnteredUsersSum(newUsersSum));
    }
  };

  const usersSumInputBlurHandler = (userId: string) => {
    if (
      !isEnteredUsersSumValid[userId] &&
      isSumValid(enteredUsersSum[userId] ?? '')
    ) {
      const newIsEnteredUsersSumValid = { ...isEnteredUsersSumValid };
      newIsEnteredUsersSumValid[userId] = true;
      dispatch(setIsEnteredUsersSumValid(newIsEnteredUsersSumValid));
    }
    Object.keys(enteredUsersSum).forEach((id) => {
      if (enteredUsersSum[id] === '0') {
        const newUsersSum = {
          ...enteredUsersSum,
        };
        delete newUsersSum[id];
        dispatch(setEnteredUsersSum(newUsersSum));
      }
    });
  };

  const showInputError = (id: string) => {
    return (
      sumRemainsError[id] ||
      sumError[id] ||
      !(isEnteredUsersSumValid[id] ?? true)
    );
  };

  return (
    <>
      {isMyselfIncluded && currentUserId && (
        <>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <TextField
                variant='outlined'
                label='Моя сумма'
                value={myselfSum || ''}
                onChange={myselfSumInputChangaHandler}
                type='text'
                id='myselfSum'
                inputProps={{
                  inputMode: 'numeric',
                  pattern: validationProps.sum.inputPropsPattern,
                  title: validationProps.sum.errorTitle,
                }}
                helperText={choseSumTextHelper(
                  sumRemainsError,
                  sumError,
                  isEnteredUsersSumValid[currentUserId] ?? true,
                  currentUserId,
                )}
                error={showInputError(currentUserId)}
                style={{ whiteSpace: 'pre-wrap' }}
                className={myselfSum ? classes.valid : undefined}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <TextField
                variant='outlined'
                label='Сумма к распределению'
                value={totalSum <= 0 ? '' : totalSum}
                type='text'
                id='totalSum'
                InputProps={{
                  readOnly: true,
                }}
                className={totalSum ? classes.valid : undefined}
              />
            </FormControl>
          </Grid>
        </>
      )}
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
            onClick={shareSum}
            endIcon={<SafetyDividerIcon />}
          >
            Поделить поровну
          </Button>
        </Stack>
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
                  sumError,
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
