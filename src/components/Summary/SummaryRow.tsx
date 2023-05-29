import {
  Grid,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { formatDate } from '../../utils/formatDate';
import { HistoryData } from './Summary';

type SummaryRowProps = {
  name: string;
  valueGain: (string | number)[];
  valueLost: (string | number)[];
  total: (string | number)[];
  history: HistoryData[];
};

function SummaryRow({ row }: { row: SummaryRowProps }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
            disabled={row.history.length === 0}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.history.length}</TableCell>
        <TableCell component='th' scope='row'>
          {row.name}
        </TableCell>
        <TableCell align='right'>
          <Grid item xs={1} md={1} lg={1}>
            {row.valueGain}
          </Grid>
        </TableCell>
        <TableCell align='right'>{row.valueLost}</TableCell>
        <TableCell align='right'>{row.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Описание</TableCell>
                    <TableCell align='right'>Сумма</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow: HistoryData) => (
                    <TableRow key={nanoid()}>
                      <TableCell component='th' scope='row'>
                        {formatDate(historyRow.date)}
                      </TableCell>
                      <TableCell>{historyRow.description}</TableCell>
                      <TableCell align='right'>{historyRow.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default SummaryRow;
