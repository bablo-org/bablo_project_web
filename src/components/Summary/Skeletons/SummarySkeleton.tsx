import {
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import SummaryRowSkeleton from './SummaryRowSkeleton';

function SummarySkeleton() {
  return (
    <>
      <Typography variant='h6' gutterBottom component='div'>
        Подтвержденные транзакции
      </Typography>
      <Skeleton sx={{ padding: 2, mb: 1 }} />
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Кол-во</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell align='right'>Я получу</TableCell>
              <TableCell align='right'>Я Должен</TableCell>
              <TableCell align='right'>Итоги</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(Array(5)).map(() => {
              return <SummaryRowSkeleton key={nanoid()} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
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
        <Grid
          container
          sx={{
            paddingTop: 2,
            paddingBottom: 2,
          }}
          justifyContent='space-between'
        >
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <div>Итоговая сумма</div>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Skeleton />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default SummarySkeleton;
