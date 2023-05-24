import { useState } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
  ButtonGroup,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ExpandMore, ArrowForward } from '@mui/icons-material';
import { formatDate } from '../../utils/formatDate';
import { auth } from '../../services/firebase';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
  useGetUsers,
} from '../../queries';

const ExpandMoreIcon = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

function TransactionItem({
  sender,
  receiver,
  description,
  date,
  status,
  created,
  updated,
  currency,
  amount,
  id,
  senderId,
  recieverId,
}) {
  const { data: users } = useGetUsers();
  const currentUserId = auth.currentUser.uid;
  const { mutate: putTransactionsApprove, status: approveStatus } =
    useApproveTransation();
  const { mutate: putTransactionsComplete, status: completeStatus } =
    useCompleteTransation();
  const { mutate: putTransactionsDecline, status: declineStatus } =
    useDeclineTransation();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
    <Card sx={{ marginBottom: 2, fontSize: 'small' }}>
      <CardHeader
        title={
          <>
            <Typography>Транзакция</Typography>
            <Typography sx={{ marginBottom: 2 }}>
              {JSON.stringify(formatDate(date))}
            </Typography>
          </>
        }
        subheader={
          <>
            <UserAvatar
              name={sender}
              id={senderId}
              avatarUrl={users.find((u) => u.id === senderId)?.avatar}
            />
            <ArrowForward
              fontSize='large'
              color='action'
              sx={{ margin: 'auto' }}
            />
            <UserAvatar
              name={receiver}
              id={recieverId}
              avatarUrl={users.find((u) => u.id === recieverId)?.avatar}
            />
          </>
        }
      />
      <CardContent>
        <Typography align='center'>
          Статус:
          {` ${status}`}
        </Typography>
        <Typography>
          Описание:
          {` ${description}`}
        </Typography>
        <Typography
          variant='body3'
          fontWeight='bold'
          color='#ad5502'
          fontSize='large'
        >
          Сумма: {`${amount} ${currency}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ButtonGroup
          size='small'
          variant='contained'
          aria-label='outlined primary button group'
        >
          {currentUserId === senderId && status === 'PENDING' && (
            <>
              <LoadingButton
                onClick={putTransactionsApproveHandler}
                loading={approveStatus === 'loading'}
                color='success'
                variant='outlined'
              >
                Подтвердить
              </LoadingButton>
              <LoadingButton
                loading={declineStatus === 'loading'}
                onClick={putTransactionsDeclineHandler}
                color='error'
                variant='outlined'
              >
                Отклонить
              </LoadingButton>
            </>
          )}
          {status === 'APPROVED' && recieverId === currentUserId && (
            <LoadingButton
              loading={completeStatus === 'loading'}
              onClick={putTransactionsCompleteHandler}
              variant='outlined'
            >
              Завершить
            </LoadingButton>
          )}
        </ButtonGroup>
        <ExpandMoreIcon
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMore />
        </ExpandMoreIcon>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          {[
            `Создана: ${JSON.stringify(formatDate(created))}`,
            `Обновлена: ${JSON.stringify(formatDate(updated))}`,
          ].map((text) => (
            <Typography key={text}>{text}</Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default TransactionItem;
