import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { printArr } from './utils/displayData';

type Props = string[];
function Overall({ overall }: { overall: Props }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='center'>Overall</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{printArr(overall)}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default Overall;
