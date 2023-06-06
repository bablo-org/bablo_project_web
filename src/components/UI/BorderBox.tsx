import { Box } from '@mui/material';

function BorderBox({ children }: { children: JSX.Element }) {
  return (
    <Box sx={{ border: 1, borderRadius: 8, marginBottom: 2 }}>{children}</Box>
  );
}

export default BorderBox;
