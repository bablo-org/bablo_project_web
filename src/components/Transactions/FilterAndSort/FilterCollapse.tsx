import Box from '@mui/material/Box';
import { Collapse, Grid } from '@mui/material';
import UserAutocomplete from './FIlterFields/UserAutocomplete';
import CurrencyAutocomplete from './FIlterFields/CurrencyAutocomplete';
import IncomingOutcomingFilter from './FIlterFields/IncomingOutcomingFilter';
import User from '../../../models/User';

function FilterAnim({
  checked,
  users,
}: {
  checked: boolean;
  users: User[] | undefined;
}) {
  const currencyAutocompleteField = <CurrencyAutocomplete users={users} />;
  const userAutocompleteField = <UserAutocomplete users={users} />;
  const IncomingOutcomingFilterField = <IncomingOutcomingFilter />;
  return (
    <Collapse in={checked}>
      <Box>
        <Box sx={{ marginY: 2, display: 'flex', flexDirection: 'row' }}>
          <Grid container direction='row' justifyContent='center'>
            <Grid sx={{ padding: 1 }} item xs={12} md={4}>
              {userAutocompleteField}
            </Grid>
            <Grid sx={{ padding: 1 }} item xs={12} md={4}>
              {IncomingOutcomingFilterField}
            </Grid>
            <Grid sx={{ padding: 1 }} item xs={12} md={4}>
              {currencyAutocompleteField}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Collapse>
  );
}

export default FilterAnim;
