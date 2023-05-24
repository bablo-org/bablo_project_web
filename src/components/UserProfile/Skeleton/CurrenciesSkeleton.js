import { Tooltip, Chip, Stack, Grid } from '@mui/material';
import renderGridContent from './renderGridContent';

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
        {renderGridContent(2)}
      </Grid>
    </>
  );
}

export default CurrenciesSkeleton;
