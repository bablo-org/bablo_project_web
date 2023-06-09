import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface SortMenuProps {
  setSortByDate: (bool: boolean) => void;
  setSortBySum: (bool: boolean) => void;
  sortByDate: boolean;
  sortBySum: boolean;
}

function SortMenu({
  setSortByDate,
  setSortBySum,
  sortByDate,
  sortBySum,
}: SortMenuProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortByDate = () => {
    setSortByDate(true);
    setSortBySum(false);
    handleClose();
  };
  const handleSortBySum = () => {
    setSortByDate(false);
    setSortBySum(true);
    handleClose();
  };

  return (
    <Box>
      <Button
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        variant={open ? 'contained' : 'outlined'}
        onClick={handleClick}
        sx={{
          height: '41px',
        }}
      >
        {t('transactionsPage.transactionLayout.sortButton')}
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem selected={sortByDate} divider onClick={handleSortByDate}>
          {t('transactionsPage.sortMenu.date')}
        </MenuItem>
        <MenuItem selected={sortBySum} onClick={handleSortBySum}>
          {t('transactionsPage.sortMenu.sum')}
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default SortMenu;
