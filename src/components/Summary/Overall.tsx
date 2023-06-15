import { Box, Paper, Typography } from '@mui/material';

interface Props {
  totals: { [key: string]: number };
}
function Overall({ totals }: Props) {
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <div>Итоговая сумма</div>
      <Box
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        {Object.entries(totals).map((entry) => (
          <Typography
            key={entry[0]}
            padding={0.5}
            variant='body2'
            align='right'
          >
            {entry[0]}: {entry[1]}
          </Typography>
        ))}
      </Box>
    </Paper>
  );
}

export default Overall;
