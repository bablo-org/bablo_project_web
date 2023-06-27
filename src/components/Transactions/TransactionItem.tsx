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
import { useMemo } from 'react';
import moment from 'moment';
import { auth } from '../../services/firebase';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  useApproveTransation,
  useCompleteTransation,
  useDeclineTransation,
} from '../../queries';
import BorderBox from '../UI/BorderBox';
import DescriptionTooltip from './DescriptionTooltip';
import {
  TransactionStatus,
  getStatusColor,
  getStatusString,
} from '../../models/enums/TransactionStatus';
import User from '../../models/User';

type TransactionItemProps = {
  description: string;
  date: number;
  status: TransactionStatus;
  currency: string;
  amount: number;
  id: string;
  senderId: string;
  recieverId: string;
  users: User[] | undefined;
};
function TransactionItem({
  description,
  date,
  status,
  currency,
  amount,
  id,
  senderId,
  recieverId,
  users,
}: TransactionItemProps) {
  const currentUserId = auth?.currentUser?.uid;

  const showButtonContainer = useMemo(() => {
    return (
      (currentUserId === senderId && status === 'PENDING') ||
      (status === 'APPROVED' && recieverId === currentUserId)
    );
  }, [currentUserId, status, senderId, recieverId]);

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

  // a user with whom the current trasaction is
  const secondUser = useMemo(() => {
    if (currentUserId === senderId) {
      return users?.find((user) => user.id === recieverId);
    }
    return users?.find((user) => user.id === senderId);
  }, [users, currentUserId]);

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
                    id={recieverId}
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
                    color={getStatusColor(status)}
                  >
                    {getStatusString(status)}
                  </Typography>
                </Box>
              </Box>
            }
          />
          <CardContent>
            <Box
              sx={{
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                borderRadius: 2,
                padding: 1,
              }}
            >
              <Typography
                align='left'
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                }}
              >
                <DescriptionTooltip tooltipDescription={`${description}`} />
              </Typography>
            </Box>
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
              {moment(date).format('LL')}
            </Typography>
            <Typography
              variant='body2'
              fontWeight='bold'
              color={senderId === currentUserId ? 'red' : 'green'}
              fontSize='large'
              align='left'
            >
              {`${senderId === currentUserId ? '-' : '+'}${amount} ${currency}`}
            </Typography>
          </CardContent>
          {showButtonContainer && (
            <CardActions>
              {currentUserId === senderId && status === 'PENDING' && (
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
              {status === 'APPROVED' && recieverId === currentUserId && (
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

export default TransactionItem;
