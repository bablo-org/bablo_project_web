import { KeyboardArrowDown } from '@mui/icons-material';
import { IconButton, Skeleton, TableCell, TableRow } from '@mui/material';

function SummaryRowSkeleton() {
  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell>
        <IconButton disabled aria-label='expand row' size='small'>
          <KeyboardArrowDown />
        </IconButton>
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell component='th' scope='row'>
        <Skeleton />
      </TableCell>
      <TableCell align='right'>
        <Skeleton />
      </TableCell>
      <TableCell align='right'>
        <Skeleton />
      </TableCell>
      <TableCell align='right'>
        <Skeleton />
      </TableCell>
    </TableRow>
  );
}

export default SummaryRowSkeleton;
