import { Paper } from '@mui/material';

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
      <div>
        {Object.entries(totals).map((entry) => (
          <p>
            {entry[0]}: {entry[1]}
          </p>
        ))}
      </div>
    </Paper>
  );
}

export default Overall;
