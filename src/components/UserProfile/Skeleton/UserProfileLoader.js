import { Grid, CircularProgress } from '@mui/material';

function UserProfileLoader() {
  return (
    <Grid
      container
      spacing={2}
      direction='column'
      sx={{ textAlign: 'left', marginTop: '5px' }}
    >
      <Grid item xs={12}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}

export default UserProfileLoader;
