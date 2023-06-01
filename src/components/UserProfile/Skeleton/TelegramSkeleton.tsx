import { Skeleton, Grid } from '@mui/material';
import renderGridContent from './renderGridContent';

function TelegramSkeleton() {
  return (
    <Grid
      container
      spacing={2}
      direction='column'
      sx={{ textAlign: 'left', marginTop: '5px' }}
    >
      <Grid item xs={12}>
        <Skeleton variant='text' sx={{ width: '200px' }} />
      </Grid>
      {renderGridContent(2)}
    </Grid>
  );
}
export default TelegramSkeleton;
