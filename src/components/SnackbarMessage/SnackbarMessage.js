import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { closeSnackbarMessage } from '../../store/slices/snackbarMessage';

function SnackbarMessage() {
  const dispatch = useDispatch();
  const { open, severity, message } = useSelector(
    (state) => state.snackbarMessage,
  );
  const handleClose = () => {
    dispatch(closeSnackbarMessage());
  };

  return (
    <Snackbar open={open} onClose={handleClose} autoHideDuration={5000}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
export default SnackbarMessage;
