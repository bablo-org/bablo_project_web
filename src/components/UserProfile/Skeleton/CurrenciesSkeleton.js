import {
  Tooltip,
  Chip,
  Stack,
  Grid,
  Divider,
  Skeleton,
  Button,
} from '@mui/material';

function CurrenciesSkeleton() {
  const renderTooltips = () => {
    const tooltips = [];
    for (let i = 0; i < 3; i++) {
      tooltips.push(
        <Tooltip key={i}>
          <Chip
            label={<Stack direction='row' spacing={1} />}
            key={i}
            sx={{ width: '100px' }}
          />
        </Tooltip>,
      );
    }
    return tooltips;
  };
  const renderGridContent = () => {
    const grid = [];
    for (let i = 0; i < 2; i++) {
      grid.push(
        <Grid item xs={12}>
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
  return (
    <>
      <Grid
        container
        spacing={2}
        direction='column'
        sx={{ textAlign: 'left', marginTop: '5px' }}
      >
        <Grid item xs={12}>
          <Stack
            direction='row'
            spacing={2}
            sx={{
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'left' },
            }}
            useFlexGap
            flexWrap='wrap'
          >
            {renderTooltips()}
          </Stack>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        direction='column'
        sx={{ textAlign: 'left', marginTop: '5px' }}
      >
        {renderGridContent()}
      </Grid>
    </>
  );
}

export default CurrenciesSkeleton;
