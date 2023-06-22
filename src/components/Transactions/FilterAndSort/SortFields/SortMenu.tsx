// import { useState } from 'react';
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import { Box } from '@mui/material';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';

// function SortMenu() {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <Box>
//       <Button
//         endIcon={open ? <ExpandLess /> : <ExpandMore />}
//         variant={open ? 'contained' : 'outlined'}
//         onClick={handleClick}
//         sx={{
//           height: '41px',
//         }}
//       >
//         Сортировать
//       </Button>
//       <Menu
//         id='basic-menu'
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           'aria-labelledby': 'basic-button',
//         }}
//       >
//         <MenuItem divider onClick={handleClose}>
//           По дате
//         </MenuItem>
//         <MenuItem onClick={handleClose}>По сумме</MenuItem>
//       </Menu>
//     </Box>
//   );
// }

// export default SortMenu;
// WILL BE SOON
