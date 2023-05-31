import { Stack, Grid, Divider, Skeleton, Button } from '@mui/material';

const renderGridContent = (n: number) => {
  const grid = [];
  for (let i = 0; i < n; i++) {
    grid.push(
      <Grid item xs={12} key={i}>
        <Stack
          direction='row'
          spacing={2}
          sx={{ alignItems: 'center' }}
          divider={<Divider orientation='vertical' flexItem />}
        >
          <Skeleton variant='text' sx={{ width: '200px' }} />
          <Button>
            <Skeleton variant='rounded' sx={{ width: '100%' }} />
          </Button>
        </Stack>
      </Grid>,
    );
  }
  return grid;
};

export default renderGridContent;
