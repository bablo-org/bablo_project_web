import { auth } from '../../services/firebase';
import useHomeApi from '../../hooks/useHomeApi';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { deepPurple } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { auto } from '@popperjs/core';
import { ArrowForward } from '@mui/icons-material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
const TransactionItem = ({
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
  reFetchTransactions,
}) => {
  const currentUserId = auth.currentUser.uid;
  const [isLoading, setIsLoading] = useState(false);
  const {
    putTransactionsApprove,
    putTransactionsComplete,
    putTransactionsDecline,
  } = useHomeApi();
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatDate = (ISOStringDate) => {
    const readableDate = new Date(ISOStringDate);
    let day = readableDate.getDate();
    let month = readableDate.getMonth() + 1;
    let year = readableDate.getFullYear();
    if (day < 10) {
      day = `0` + day;
    }
    if (month < 10) {
      month = `0` + month;
    }
    return day + `/` + month + `/` + year;
  };
  const putTransactionsDeclineHandler = () => {
    setIsLoading(true);
    putTransactionsDecline(JSON.stringify([id]))
      .then(() => reFetchTransactions())
      .finally(() => setIsLoading(false));
  };
  const putTransactionsCompleteHandler = () => {
    setIsLoading(true);
    putTransactionsComplete(JSON.stringify([id]))
      .then(() => reFetchTransactions())
      .finally(() => setIsLoading(false));
  };
  const putTransactionsApproveHandler = () => {
    putTransactionsApprove(JSON.stringify([id]))
      .then(() => reFetchTransactions())
      .finally(() => setIsLoading(false));
  };

  return (
    <Card sx={{ marginBottom: 2, fontSize: 'small' }}>
      <CardHeader
        sx={{ margin: auto }}
        avatar={
          <>
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                fontSize: 12,
                width: 66,
                height: 66,
              }}
            >
              {sender}
            </Avatar>
            <ArrowForward
              sx={{ margin: auto }}
              fontSize="large"
              color="action"
            />
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
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
        <Typography>Статус: {status}</Typography>
        <Typography
          variant="body3"
          fontWeight="bold"
          color="#ad5502"
          fontSize="large"
        >
          Сумма: {amount + ` ` + currency}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <ButtonGroup
          size="small"
          variant="contained"
          aria-label="outlined primary button group"
        >
          {currentUserId === senderId && status === `PENDING` && !isLoading && (
            <>
              <Button onClick={putTransactionsApproveHandler} color="success">
                Подтвердить
              </Button>
              <Button onClick={putTransactionsDeclineHandler} color="error">
                Отклонить
              </Button>
            </>
          )}
          {status === `APPROVED` &&
            recieverId === currentUserId &&
            !isLoading && (
              <Button onClick={putTransactionsCompleteHandler}>
                Завершить
              </Button>
            )}
        </ButtonGroup>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {[
            `Описание: ` + description,
            `Создана: ` + JSON.stringify(formatDate(created)),
            `Обновлена: ` + JSON.stringify(formatDate(updated)),
          ].map((text) => (
            <Typography key={text}>{text}</Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};
// A|-|T0N пеDICK
export default TransactionItem;
