import { useState } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  colors,
  ButtonGroup,
  Button,
} from '@mui/material';
import { ExpandMore, ArrowForward } from '@mui/icons-material';
import { formatDate } from '../../utils/formatDate';
import { auth } from '../../services/firebase';
import {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
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
  const currentUserId = auth.currentUser.uid;

  const {
    mutateAsync: putTransactionsApprove,
    isFetching: isApproveInProgress,
  } = useApproveTransation();
  const {
    mutateAsync: putTransactionsComplete,
    isFetching: isCompleteInProgress,
  } = useCompleteTransation();
  const {
    mutateAsync: putTransactionsDecline,
    isFetching: isDeclineeInProgress,
  } = useDeclineTransation();
  const [expanded, setExpanded] = useState(false);

  const isLoading = React.useMemo(
    () => isApproveInProgress || isCompleteInProgress || isDeclineeInProgress,
    [isApproveInProgress, isCompleteInProgress, isDeclineeInProgress],
  );
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
        avatar={
          <>
            <Avatar
              sx={{
                bgcolor: colors.deepPurple[500],
                fontSize: 12,
                width: 66,
                height: 66,
              }}
            >
              {sender}
            </Avatar>
            <ArrowForward fontSize='large' color='action' />
            <Avatar
              sx={{
                bgcolor: colors.deepPurple[500],
                fontSize: 12,
                width: 66,
                height: 66,
              }}
            >
              {receiver}
            </Avatar>
          </>
        }
        title={<Typography>Транзакция</Typography>}
        subheader={<Typography>{JSON.stringify(formatDate(date))}</Typography>}
      />
      <CardContent>
        <Typography>
          Статус:
          {status}
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
          {currentUserId === senderId && status === 'PENDING' && !isLoading && (
            <>
              <Button onClick={putTransactionsApproveHandler} color='success'>
                Подтвердить
              </Button>
              <Button onClick={putTransactionsDeclineHandler} color='error'>
                Отклонить
              </Button>
            </>
          )}
          {status === 'APPROVED' &&
            recieverId === currentUserId &&
            !isLoading && (
              <Button onClick={putTransactionsCompleteHandler}>
                Завершить
              </Button>
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
            `Описание: ${description}`,
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
