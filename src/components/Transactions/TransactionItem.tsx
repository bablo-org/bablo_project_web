import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  ButtonGroup,
  Box,
  CardActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { formatDate } from '../../utils/formatDate';
import { auth } from '../../services/firebase';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
  useGetUsers,
} from '../../queries';
import BorderBox from '../UI/BorderBox';
import DescriptionTooltip from './DescriptionTooltip';

type TransactionItemProps = {
  sender: string;
  receiver: string;
  description: string;
  date: number;
  status: string;
  currency: string;
  amount: number;
  id: string;
  senderId: string;
  recieverId: string;
};
function TransactionItem({
  sender,
  receiver,
  description,
  date,
  status,
  currency,
  amount,
  id,
  senderId,
  recieverId,
}: TransactionItemProps) {
  const { data: users } = useGetUsers();
  const currentUserId = auth?.currentUser?.uid;
  const { mutate: putTransactionsApprove, status: approveStatus } =
    useApproveTransation();
  const { mutate: putTransactionsComplete, status: completeStatus } =
    useCompleteTransation();
  const { mutate: putTransactionsDecline, status: declineStatus } =
    useDeclineTransation();
  const putTransactionsDeclineHandler = () => {
    putTransactionsDecline([id]);
  };

  const putTransactionsCompleteHandler = () => {
    putTransactionsComplete([id]);
  };

  const putTransactionsApproveHandler = () => {
    putTransactionsApprove([id]);
  };
  return (
    <BorderBox marginProp={0}>
      <Card
        sx={{
          fontSize: 'small',
          borderRadius: 8,
        }}
      >
        <CardHeader
          title={
            <Box
              sx={{
                justifyContent: 'left',
                alignContent: 'left',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <UserAvatar
                xs={10}
                sm={10}
                md={30}
                id={recieverId}
                avatarUrl={users?.find((u) => u.id === recieverId)?.avatar}
                name=''
              />
              <Typography align='left'>{receiver}</Typography>
            </Box>
          }
        />
        <CardContent>
          <Typography align='left' marginBottom={1}>
            {JSON.stringify(formatDate(date))}
          </Typography>
          <Typography align='left'>
            Статус:
            {` ${status}`}
          </Typography>
          <Typography align='left'>
            Должник:
            {` ${sender}`}
          </Typography>
          <Typography align='left'>
            Описание:
            {description.length > 10 ? (
              <DescriptionTooltip tooltipDescription={description} />
            ) : (
              ` ${description}`
            )}
          </Typography>
          {(currentUserId === senderId && status === 'PENDING') ||
          (status === 'APPROVED' && recieverId === currentUserId) ? (
            <Typography
              variant='body2'
              fontWeight='bold'
              color={senderId === currentUserId ? 'red' : 'green'}
              fontSize='large'
              align='left'
              // marginTop={0.5}
            >
              Сумма: {`${amount} ${currency}`}
            </Typography>
          ) : (
            <Typography
              variant='body2'
              fontWeight='bold'
              color='white'
              fontSize='large'
              align='left'
              // marginTop={0.5}
            >
              -
            </Typography>
          )}
        </CardContent>
        <CardActions>
          {currentUserId === senderId && status === 'PENDING' && (
            <ButtonGroup
              fullWidth
              sx={{ borderRadius: 8 }}
              size='small'
              variant='contained'
              aria-label='outlined primary button group'
            >
              <LoadingButton
                sx={{ borderRadius: 8 }}
                onClick={putTransactionsApproveHandler}
                loading={approveStatus === 'loading'}
                color='success'
                variant='outlined'
              >
                Подтвердить
              </LoadingButton>
              <LoadingButton
                sx={{ borderRadius: 8 }}
                loading={declineStatus === 'loading'}
                onClick={putTransactionsDeclineHandler}
                color='error'
                variant='outlined'
              >
                Отклонить
              </LoadingButton>
            </ButtonGroup>
          )}
          {!(currentUserId === senderId && status === 'PENDING') &&
            !(status === 'APPROVED' && recieverId === currentUserId) && (
              <Typography
                variant='body2'
                fontWeight='bold'
                color={senderId === currentUserId ? 'red' : 'green'}
                fontSize='large'
                align='left'
              >
                Сумма: {`${amount} ${currency}`}
              </Typography>
            )}
          {status === 'APPROVED' && recieverId === currentUserId && (
            <LoadingButton
              sx={{ borderRadius: 8 }}
              fullWidth
              size='small'
              loading={completeStatus === 'loading'}
              onClick={putTransactionsCompleteHandler}
              variant='outlined'
            >
              Завершить
            </LoadingButton>
          )}
        </CardActions>
      </Card>
    </BorderBox>
  );
}

export default TransactionItem;
