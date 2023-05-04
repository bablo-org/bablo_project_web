import { useEffect, useReducer, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

function snackbarReducer(state, action) {
  switch (action.type) {
    case 'success':
      return {
        open: true,
        message: 'Изменения успешно сохранены',
        severity: 'success',
      };
    case 'error':
      return {
        open: true,
        message: 'Что-то пошло не так... Попробуйте перезагрузить страницу.',
        severity: 'error',
      };
    case 'close':
      return { ...state, open: false };
    default:
      return { ...state, open: false };
  }
}

function SnackbarMessage({ type, onClose }) {
  const [state, dispatch] = useReducer(snackbarReducer, {
    open: false,
    message: '',
    severity: 'success',
  });
  const [isClosed, setIsClosed] = useState(false);

  const handleClose = () => {
    onClose();
    setIsClosed(true);
  };

  useEffect(() => {
    setIsClosed(false);
    dispatch({ type });
  }, [type, isClosed]);

  return (
    <Snackbar open={state.open} onClose={handleClose} autoHideDuration={5000}>
      <Alert
        onClose={handleClose}
        severity={state.severity}
        sx={{ width: '100%' }}
      >
        {state.message}
      </Alert>
    </Snackbar>
  );
}
export default SnackbarMessage;
