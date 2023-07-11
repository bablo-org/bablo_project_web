import { Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  totals: { [key: string]: number };
}
function Overall({ totals }: Props) {
  const { t } = useTranslation();
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
      <div>{t('summaryPage.summaryTable.grandTotal')}</div>
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
