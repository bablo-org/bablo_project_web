import Box from '@mui/material/Box';
import { Collapse, Grid } from '@mui/material';
import UserAutocomplete from './FIlterFields/UserAutocomplete';
import CurrencyAutocomplete from './FIlterFields/CurrencyAutocomplete';
import IncomingOutcomingFilter from './FIlterFields/IncomingOutcomingFilter';
import User from '../../../models/User';

function FilterCollapse({
  checked,
  users,
}: {
  checked: boolean;
  users: User[] | undefined;
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
              <UserAutocomplete users={users} />
            </Grid>
            <Grid sx={{ padding: 1 }} item xs={12} sm={12} md={6} lg={4}>
              <IncomingOutcomingFilter />
            </Grid>
            <Grid sx={{ padding: 1 }} item xs={12} sm={12} md={6} lg={4}>
              <CurrencyAutocomplete users={users} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Collapse>
  );
}

export default FilterCollapse;
