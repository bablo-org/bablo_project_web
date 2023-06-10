import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { LoadingButton } from '@mui/lab';
import { useUpdateUser } from '../../queries';

interface RequestNameDialogProps {
  open: boolean;
  onClose?: () => void;
}

export default function RequestNameDialog({
  open,
  onClose,
}: RequestNameDialogProps) {
  const { mutateAsync: updateUser } = useUpdateUser();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await updateUser({ name });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Type in your name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your name to be displayed when communicating with other users
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Name'
            type='text'
            fullWidth
            variant='standard'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton onClick={handleConfirm} loading={isLoading}>
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
