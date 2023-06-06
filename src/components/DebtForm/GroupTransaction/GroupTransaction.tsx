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
    enteredUsersSum,
    isEnteredUsersSumValid,
    sumRemainsError,
    sumError,
    manualInputs,
    isMyselfIncluded,
  } = useAppSelector((state) => state.addTransaction);
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.auth.user?.uid);
  const currentUser = users?.find((item) => item.id === currentUserId);

  const toogleIsMyselfInclude = () => {
    if (isMyselfIncluded) {
      dispatch(setEnteredUsersSum({}));
      dispatch(clearAllSumErrors({ clearManualInputs: false }));
    }
    dispatch(setIsMyselfIncluded(!isMyselfIncluded));
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
    const sumInputs = [...sender];
    if (isMyselfIncluded) {
      sumInputs.push(currentUserId!);
    }

    newUsersSum[user.id] = replaceComma(event.target.value);
    newSumError[user.id] = true;
    newIsEnteredUsersSumValid[user.id] = false;

    // add input as manualInput
    if (!manualInputs.includes(user.id) && enteredSum) {
      newManualInputs.push(user.id);
      dispatch(setManualInputs(newManualInputs));
    }

    // validation input
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

    // validation controll sum
    if (
      enteredSum &&
      +newUsersSum[user.id] > +enteredSum &&
      !isAllManual(newManualInputs, sumInputs.length)
    ) {
      const newSumRemainsError = { ...sumRemainsError };
      newSumRemainsError[user.id] = true;
      dispatch(setSumRemainsError(newSumRemainsError));
      dispatch(setEnteredUsersSum(newUsersSum));
      return;
    }

    if (enteredSum) {
      // set sumRemains witout input value
      let sumRemains = +enteredSum - +newUsersSum[user.id];

      // set sumRemains without values at manual inputs
      manualInputs.forEach((id) => {
        if (id in enteredUsersSum && id !== user.id) {
          sumRemains -= +enteredUsersSum[id];
        }
      });

      // case if all inputs as manual
      // set total sum as amount of inputs and alert User
      if (isAllManual(newManualInputs, sumInputs.length)) {
        let sum = +newUsersSum[user.id];
        manualInputs.forEach((id) => {
          if (id in enteredUsersSum && id !== user.id) {
            sum += +enteredUsersSum[id];
          }
        });
        sumRemains = 0;
        dispatch(setEnteredSum(sum.toString()));
        dispatch(
          showSnackbarMessage({
            severity: SnackbarSeverity.WARNING,
            message: 'Общая сумма транзакции изменилась',
          }),
        );
      }

      // validation controll sum and sumRemains spread at not manual inputs
      if (isSumValid(roundSum(sumRemains, 1).toString())) {
        sumInputs.forEach((itemId) => {
          if (itemId !== user.id && !manualInputs.includes(itemId)) {
            const amount = sumInputs.length - newManualInputs.length;
            newUsersSum[itemId] = roundSum(sumRemains, amount).toString();
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
                  sumError,
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
