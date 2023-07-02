import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  ButtonGroup,
  Box,
  CardActions,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { nanoid } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import BorderBox from '../UI/BorderBox';
import {
  TransactionStatus,
  getStatusColor,
} from '../../models/enums/TransactionStatus';
import {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
} from '../../queries';
import { auth } from '../../services/firebase';
import User from '../../models/User';
import Transaction from '../../models/Transaction';

interface TransactionCardProps {
  users: User[];
  transaction: Transaction;
  previewMode?: boolean;
}

function TransactionCard({
  users,
  transaction,
  previewMode = false,
}: TransactionCardProps) {
  const currentUserId = auth?.currentUser?.uid;
  const { mutate: putTransactionsApprove, status: approveStatus } =
    useApproveTransation();
  const { mutate: putTransactionsComplete, status: completeStatus } =
    useCompleteTransation();
  const { mutate: putTransactionsDecline, status: declineStatus } =
    useDeclineTransation();

  // a user with whom the current trasaction is
  const secondUser = useMemo(() => {
    if (currentUserId === transaction.sender) {
      return users?.find((user) => user.id === transaction.receiver);
    }
    return users?.find((user) => user.id === transaction.sender);
  }, [users, transaction]);

  const showButtonContainer = useMemo(() => {
    if (previewMode) {
      return false;
    }
    if (
      transaction.sender === currentUserId &&
      transaction.status === TransactionStatus.PENDING
    ) {
      return true;
    }
    if (
      transaction.receiver === currentUserId &&
      transaction.status === TransactionStatus.APPROVED
    ) {
      return true;
    }
    return false;
  }, [transaction, previewMode]);

  const putTransactionsDeclineHandler = () => {
    putTransactionsDecline([transaction.id]);
  };

  const putTransactionsCompleteHandler = () => {
    putTransactionsComplete([transaction.id]);
  };

  const putTransactionsApproveHandler = () => {
    putTransactionsApprove([transaction.id]);
  };

  const renderDescription = useMemo(() => {
    return transaction.description.split('\n').map((line, index) => (
      <Typography
        variant='body1'
        sx={{ textIndent: index > 1 ? '20px' : '0px' }}
        key={nanoid()}
      >
        {line}
      </Typography>
    ));
  }, [transaction]);

  return (
    <BorderBox
      marginProp={0}
      borderRadius={2}
      style={{
        height: '100%',
      }}
    >
      <Card
        sx={{
          fontSize: 'small',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <CardHeader
            title={
              <Box
                sx={{
                  justifyContent: 'space-between',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Box display='flex' flexDirection='row'>
                  <UserAvatar
                    xs={30}
                    sm={30}
                    md={30}
                    id={transaction.receiver}
                    avatarUrl={secondUser?.avatar}
                    name=''
                    style={{
                      boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                      marginRight: '10px',
                      marginLeft: '0px',
                    }}
                  />
                  <Typography alignSelf='center' align='left' fontWeight='bold'>
                    {secondUser?.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    alignSelf='center'
                    fontWeight='bold'
                    fontSize={14}
                    color={getStatusColor(transaction.status)}
                  >
                    {transaction.status}
                  </Typography>
                </Box>
              </Box>
            }
          />
          <CardContent>
            <Tooltip
              arrow
              sx={{
                textAlign: 'left',
              }}
              title={<Typography fontSize={17}>{renderDescription}</Typography>}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  borderRadius: 2,
                  padding: 1,
                  textAlign: 'left',
                }}
              >
                {renderDescription}
              </Box>
            </Tooltip>
          </CardContent>
        </Box>
        <Box>
          <CardContent
            sx={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <Typography align='left' fontSize={14} fontWeight='bold'>
              {moment(transaction.date).format('LL')}
            </Typography>
            <Typography
              variant='body2'
              fontWeight='bold'
              color={transaction.sender === currentUserId ? 'red' : 'green'}
              fontSize='large'
              align='left'
            >
              {transaction.amount} {transaction.currency}
            </Typography>
          </CardContent>
          {showButtonContainer && (
            <CardActions>
              {transaction.status === TransactionStatus.PENDING && (
                <ButtonGroup
                  fullWidth
                  sx={{ borderRadius: 2 }}
                  size='small'
                  variant='outlined'
                  aria-label='outlined primary button group'
                >
                  <LoadingButton
                    sx={{ borderRadius: 2 }}
                    loading={declineStatus === 'loading'}
                    onClick={putTransactionsDeclineHandler}
                    color='error'
                    variant='outlined'
                  >
                    Отклонить
                  </LoadingButton>
                  <LoadingButton
                    sx={{ borderRadius: 2 }}
                    onClick={putTransactionsApproveHandler}
                    loading={approveStatus === 'loading'}
                    color='success'
                    variant='outlined'
                  >
                    Подтвердить
                  </LoadingButton>
                </ButtonGroup>
              )}
              {transaction.status === TransactionStatus.APPROVED && (
                <LoadingButton
                  sx={{ borderRadius: 2 }}
                  fullWidth
                  size='small'
                  loading={completeStatus === 'loading'}
                  onClick={putTransactionsCompleteHandler}
                  variant='outlined'
                  color='success'
                >
                  Завершить
                </LoadingButton>
              )}
            </CardActions>
          )}
        </Box>
      </Card>
    </BorderBox>
  );
}

export default TransactionCard;
