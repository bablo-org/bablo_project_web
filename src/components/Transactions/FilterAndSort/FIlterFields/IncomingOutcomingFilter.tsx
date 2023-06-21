import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';

function IncomingOutcomingFilter() {
  const [alignment, setAlignment] = useState('Все');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color='primary'
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label='Platform'
    >
      <ToggleButton value='Все'>Все</ToggleButton>
      <ToggleButton value='Входящие'>Входящие</ToggleButton>
      <ToggleButton value='Исходящие'>Исходящие</ToggleButton>
    </ToggleButtonGroup>
  );
}

export default IncomingOutcomingFilter;
