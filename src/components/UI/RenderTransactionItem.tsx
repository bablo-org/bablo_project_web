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
import UserAvatar from '../UserAvatar/UserAvatar';
import BorderBox from './BorderBox';

interface RenderTransactionItemProps {
  avatarId: string;
  avatarUrl: string | undefined;
  userName: string | undefined;
  statusColor: string;
  status: string;
  description: string | JSX.Element[];
  date: number | undefined;
  amountColor: string;
  amount: string | undefined;
  showButtonContainer: boolean;
  isApprovedStatus?: boolean;
  isPendingStatus?: boolean;
  declineStatus?: boolean;
  declineHandler?: () => void;
  approveStatus?: boolean;
  approveHandler?: () => void;
  completeStatus?: boolean;
  completeHandler?: () => void;
}

function RenderTransactionItem({
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
  isApprovedStatus,
  isPendingStatus,
  declineStatus,
  declineHandler,
  approveStatus,
  approveHandler,
  completeStatus,
  completeHandler,
}: RenderTransactionItemProps) {
  const renderDescription = () => {
    if (typeof description === 'string') {
      return (
        <Typography
          align='left'
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
      );
    }
    return description;
  };
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
              title={<Typography fontSize={17}>{description}</Typography>}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  borderRadius: 2,
                  padding: 1,
                  textAlign: 'left',
                }}
              >
                {renderDescription()}
              </Box>
            </Tooltip>
          </CardContent>
        </Box>
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
            {isPendingStatus && (
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
            {isApprovedStatus && (
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
      </Card>
    </BorderBox>
  );
}

export default RenderTransactionItem;
