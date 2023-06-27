import {
  Grid,
  Typography,
  Card,
  Box,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import moment from 'moment';
import BorderBox from '../UI/BorderBox';
import UserAvatar from '../UserAvatar/UserAvatar';
import DescriptionTooltip from '../Transactions/DescriptionTooltip';
import { useAppSelector } from '../../store/hooks';
import User from '../../models/User';

interface RenderPreviewProps {
  users: User[] | undefined;
  startIndex: number;
  quantity: number;
  gridSize: {
    xs: number;
    md: number;
  };
  currentUserId: string | undefined;
}
function RenderPreview({
  users,
  startIndex,
  quantity,
  gridSize,
  currentUserId,
}: RenderPreviewProps) {
  const {
    enteredUsersSum,
    enteredDate,
    usedBillItemUsersDescription,
    billItemUsersDescription,
    enteredDescription,
    enteredCurrency,
    sender,
    receiver,
    enteredSum,
  } = useAppSelector((state) => state.addTransactionForm);

  if (!users || !currentUserId) {
    return null;
  }

  const renderedUsersId = sender.slice(startIndex, quantity + startIndex);
  const filterUsers = (usersId: string[]) => {
    return users.filter((user) => {
      return usersId.includes(user.id);
    });
  };
  const renderedUsers: User[] = [];

  const isRenderUserCurrentUser = sender.includes(currentUserId);

  if (isRenderUserCurrentUser) {
    renderedUsers.push(...filterUsers(receiver));
  } else {
    renderedUsers.push(...filterUsers(renderedUsersId));
  }

  const transactionSum = (user: User) => {
    const currency = enteredCurrency?.id ?? '';

    if (isRenderUserCurrentUser && enteredSum) {
      return `-${enteredSum} ${currency}`;
    }
    if (sender.length === 1 && enteredSum) {
      return `+${enteredSum} ${currency}`;
    }
    if (enteredUsersSum[user.id] && enteredUsersSum[user.id]) {
      return `+${enteredUsersSum[user.id]} ${currency}`;
    }
    return null;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ textAlign: 'left' }}>
          Сгенерированные транзакции
        </Typography>
        <Divider />
      </Grid>
      {renderedUsers.map((user) => (
        <Grid item xs={gridSize.xs} md={gridSize.md} key={user.id}>
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
                          id={user.id}
                          avatarUrl={user.avatar}
                          name=''
                          style={{
                            boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
                            marginRight: '10px',
                            marginLeft: '0px',
                          }}
                        />
                        <Typography
                          alignSelf='center'
                          align='left'
                          fontWeight='bold'
                        >
                          {user.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          alignSelf='center'
                          fontWeight='bold'
                          fontSize={14}
                          color='orange'
                        >
                          Pending
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
                    <DescriptionTooltip
                      tooltipDescription={
                        usedBillItemUsersDescription
                          ? billItemUsersDescription[user.id]
                          : enteredDescription
                      }
                    />
                  </Box>
                </CardContent>
              </Box>
              <CardContent
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              >
                <Typography align='left' fontSize={14} fontWeight='bold'>
                  {moment(enteredDate).format('LL')}
                </Typography>
                <Typography
                  variant='body2'
                  fontWeight='bold'
                  color={isRenderUserCurrentUser ? 'red' : 'green'}
                  fontSize='large'
                  align='left'
                >
                  {transactionSum(user)}
                </Typography>
              </CardContent>
            </Card>
          </BorderBox>
        </Grid>
      ))}
    </Grid>
  );
}

export default RenderPreview;
