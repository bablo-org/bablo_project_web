import { Box, SxProps, Theme } from '@mui/material';

type Props = {
  children: JSX.Element;
  marginProp: number;
  borderRadius?: number;
  style?: SxProps<Theme>;
};
function BorderBox({
  children,
  marginProp,
  borderRadius = 8,
  style = {},
}: Props) {
  return (
    <Box
      sx={{
        border: '1 rgba(0, 0, 0, 0.8)',
        borderRadius,
        marginBottom: marginProp,
        boxShadow:
          '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
        ...style,
      }}
    >
      {children}
    </Box>
  );
}

export default BorderBox;
