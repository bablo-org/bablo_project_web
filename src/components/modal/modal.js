import * as React from 'react';
import { Stack, Fade, Modal, Box, Backdrop, Typography } from '@mui/material';

function TransitionsModal({ isOpen, title, body, handleClose, icon }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
          <Box sx={style}>
            <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
              <Typography
                id='transition-modal-title'
                variant='h6'
                component='h2'
              >
                {title}
              </Typography>
              {icon}
            </Stack>
            {body}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default TransitionsModal;
