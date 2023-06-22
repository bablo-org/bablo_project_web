import Box from '@mui/material/Box';
import { Collapse, Grid } from '@mui/material';
import UserAutocomplete from './FIlterFields/UserAutocomplete';
import CurrencyAutocomplete from './FIlterFields/CurrencyAutocomplete';
import IncomingOutcomingFilter from './FIlterFields/IncomingOutcomingFilter';
import User from '../../../models/User';
import { TransactionType } from '../TransactionsList';

function FilterCollapse({
  checked,
  users,
  setTransactionType,
  selectedTransactionType,
  setSelectedCurrency,
  onChange,
}: {
  checked: boolean;
  users: User[] | undefined;
  selectedTransactionType: TransactionType;
  setTransactionType: (type: TransactionType) => void;
  setSelectedCurrency: (currency: string | null) => void;
  onChange: (userId: string[]) => void;
}) {
  return (
    <Collapse in={checked}>
      <Box>
        <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'row' }}>
          <Grid
            container
            direction='row'
            sx={{
              justifyContent: {
                md: 'flex-start',
                sm: 'center',
              },
            }}
            justifyContent='center'
          >
            <Grid sx={{ padding: 1 }} item xs={12} sm={12} md={6} lg={4}>
              <UserAutocomplete users={users} onChange={onChange} />
            </Grid>
            <Grid sx={{ padding: 1 }} item xs={12} sm={12} md={6} lg={4}>
              <IncomingOutcomingFilter
                onChange={setTransactionType}
                selectedTransactionType={selectedTransactionType}
              />
            </Grid>
            <Grid sx={{ padding: 1 }} item xs={12} sm={12} md={6} lg={4}>
              <CurrencyAutocomplete
                onChange={setSelectedCurrency}
                users={users}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Collapse>
  );
}

export default FilterCollapse;
