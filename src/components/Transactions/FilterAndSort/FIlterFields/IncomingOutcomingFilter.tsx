import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';
import { TransactionType } from '../../TransactionsList';

interface IncomingOutcomingFilterProps {
  onChange: (type: TransactionType) => void;
  selectedTransactionType: TransactionType;
}

function IncomingOutcomingFilter({
  onChange,
  selectedTransactionType,
}: IncomingOutcomingFilterProps) {
  const { t } = useTranslation();
  const getButtonTitle = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ALL:
        return t('transactionsPage.filterCollapse.statusFilter.all');
      case TransactionType.INCOMING:
        return t('transactionsPage.filterCollapse.statusFilter.incoming');
      case TransactionType.OUTCOMING:
        return t('transactionsPage.filterCollapse.statusFilter.outcoming');
      default:
        return t('transactionsPage.filterCollapse.statusFilter.all');
    }
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: TransactionType,
  ) => {
    if (!newAlignment) return;
    onChange(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color='primary'
      value={selectedTransactionType}
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
