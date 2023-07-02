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
import { TransactionStatus } from '../../models/enums/TransactionStatus';

interface TransactionCardProps {
  avatarId: string;
  avatarUrl: string | undefined;
  userName: string | undefined;
  statusColor: string;
  status: string;
  description: string[];
  date: number | undefined;
  amountColor: string;
  amount: string | undefined;
  showButtonContainer: boolean;
  itemStatus?: TransactionStatus | undefined;
  declineStatus?: boolean;
  declineHandler?: () => void;
  approveStatus?: boolean;
  approveHandler?: () => void;
  completeStatus?: boolean;
  completeHandler?: () => void;
}

function TransactionCard({
  avatarId,
  avatarUrl,
  userName,
  statusColor,
  status,
  description,
  date,
  amountColor,
  amount,
  showButtonContainer,
  itemStatus,
  declineStatus,
  declineHandler,
  approveStatus,
  approveHandler,
  completeStatus,
  completeHandler,
}: TransactionCardProps) {
  const renderDescription = useMemo(() => {
    return description.map((line, index) => (
      <Typography
        variant='body1'
        sx={{ textIndent: index > 1 ? '20px' : '0px' }}
        key={nanoid()}
      >
        {line}
      </Typography>
    ));
  }, [description]);

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
                    id={avatarId}
                    avatarUrl={avatarUrl}
                    name=''
                    style={{
                      boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                      marginRight: '10px',
                      marginLeft: '0px',
                    }}
                  />
                  <Typography alignSelf='center' align='left' fontWeight='bold'>
                    {userName}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    alignSelf='center'
                    fontWeight='bold'
                    fontSize={14}
                    color={statusColor}
                  >
                    {status}
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
              {moment(date).format('LL')}
            </Typography>
            <Typography
              variant='body2'
              fontWeight='bold'
              color={amountColor}
              fontSize='large'
              align='left'
            >
              {amount}
            </Typography>
          </CardContent>
          {showButtonContainer && (
            <CardActions>
              {itemStatus === TransactionStatus.PENDING && (
                <ButtonGroup
                  fullWidth
                  sx={{ borderRadius: 2 }}
                  size='small'
                  variant='outlined'
                  aria-label='outlined primary button group'
                >
                  <LoadingButton
                    sx={{ borderRadius: 2 }}
                    loading={declineStatus}
                    onClick={declineHandler}
                    color='error'
                    variant='outlined'
                  >
                    Отклонить
                  </LoadingButton>
                  <LoadingButton
                    sx={{ borderRadius: 2 }}
                    onClick={approveHandler}
                    loading={approveStatus}
                    color='success'
                    variant='outlined'
                  >
                    Подтвердить
                  </LoadingButton>
                </ButtonGroup>
              )}
              {itemStatus === TransactionStatus.APPROVED && (
                <LoadingButton
                  sx={{ borderRadius: 2 }}
                  fullWidth
                  size='small'
                  loading={completeStatus}
                  onClick={completeHandler}
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
