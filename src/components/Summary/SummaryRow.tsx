import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { formatDate } from '../../utils/formatDate';
import { HistoryData } from './Summary';

type SummaryRowProps = {
  name: string;
  valueGain: string[];
  valueLost: string[];
  total: string[];
  history: HistoryData[];
};

function printArr(arr: string[]) {
  return arr.map((val) => <p key={nanoid()}>{val}</p>);
}

function SummaryRow({ row }: { row: SummaryRowProps }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const addPlus = (amount: number) => {
    if (amount < 0) {
      return amount;
    }
    return `+${amount}`;
  };

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
        <TableCell align='right'>{printArr(row.valueGain)}</TableCell>
        <TableCell align='right'>{printArr(row.valueLost)}</TableCell>
        <TableCell align='right'>{printArr(row.total)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t('summaryPage.summaryTable.transactionList.date')}
                    </TableCell>
                    <TableCell>
                      {t(
                        'summaryPage.summaryTable.transactionList.description',
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      {t('summaryPage.summaryTable.transactionList.amount')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow: HistoryData) => (
                    <TableRow key={nanoid()}>
                      <TableCell component='th' scope='row'>
                        {formatDate(historyRow.date)}
                      </TableCell>
                      <TableCell>{historyRow.description}</TableCell>
                      <TableCell align='right'>
                        {addPlus(historyRow.amount)} {historyRow.currency}
                      </TableCell>
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
