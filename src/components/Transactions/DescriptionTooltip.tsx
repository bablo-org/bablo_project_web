import { Typography, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';

type DescriptionTooltipProps = { tooltipDescription: string };

function DescriptionTooltip({ tooltipDescription }: DescriptionTooltipProps) {
  const shortDescription: (descriptionArg: string) => string = (
    descriptionArg,
  ) => {
    return `${descriptionArg.substring(0, 10)}...`;
  };
  return (
    <Tooltip
      arrow
      title={<Typography fontSize={17}>{tooltipDescription}</Typography>}
    >
      <Button size='small'>{shortDescription(tooltipDescription)}</Button>
    </Tooltip>
  );
}
export default DescriptionTooltip;
