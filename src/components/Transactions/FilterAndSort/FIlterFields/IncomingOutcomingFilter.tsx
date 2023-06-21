import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useState } from 'react';

enum TransactionType {
  ALL = 'ALL',
  INCOMING = 'INCOMING',
  OUTCOMING = 'OUTCOMING',
}

function IncomingOutcomingFilter() {
  const [alignment, setAlignment] = useState<TransactionType>(
    TransactionType.ALL,
  );

  const getButtonTitle = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ALL:
        return 'Все';
      case TransactionType.INCOMING:
        return 'Входящие';
      case TransactionType.OUTCOMING:
        return 'Исходящие';
      default:
        return 'Все';
    }
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: TransactionType,
  ) => {
    if (!newAlignment) return;
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color='primary'
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label='Platform'
      fullWidth
      sx={{
        height: 56,
      }}
    >
      <ToggleButton value={TransactionType.ALL}>
        {getButtonTitle(TransactionType.ALL)}
      </ToggleButton>
      <ToggleButton value={TransactionType.INCOMING}>
        {getButtonTitle(TransactionType.INCOMING)}
      </ToggleButton>
      <ToggleButton value={TransactionType.OUTCOMING}>
        {getButtonTitle(TransactionType.OUTCOMING)}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default IncomingOutcomingFilter;
