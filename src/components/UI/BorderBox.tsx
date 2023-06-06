import { Box } from '@mui/material';

type Props = { children: JSX.Element };
function BorderBox({ children }: Props) {
  return (
    <Box sx={{ border: 1, borderRadius: 8, marginBottom: 2 }}>{children}</Box>
  );
}

export default BorderBox;
