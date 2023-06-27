import { Typography, Tooltip } from '@mui/material';

type DescriptionTooltipProps = { tooltipDescription: string };

function DescriptionTooltip({ tooltipDescription }: DescriptionTooltipProps) {
  return (
    <Tooltip
      arrow
      sx={{
        textAlign: 'left',
      }}
      title={<Typography fontSize={17}>{tooltipDescription}</Typography>}
    >
      <Typography
        align='left'
        sx={{
          display: '-webkit-box',
          overflow: 'hidden',
        }}
      >
        {tooltipDescription}
      </Typography>
    </Tooltip>
  );
}
export default DescriptionTooltip;
