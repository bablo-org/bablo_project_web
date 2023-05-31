import { Stack, Grid, FormControl } from '@mui/material';
import { ReactNode } from 'react';

function ResposibleContent({
  avatarBlock,
  inputAvatar,
  inputName,
}: {
  avatarBlock: ReactNode;
  inputAvatar: ReactNode;
  inputName: ReactNode;
}) {
  if (window.innerWidth < 820) {
    return (
      <>
        <Grid item xs={12}>
          {avatarBlock}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            {inputName}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            {inputAvatar}
          </FormControl>
        </Grid>
      </>
    );
  }
  return (
    <Grid item xs={12}>
      <Stack direction='row' spacing={2} alignItems='center'>
        <Grid item xs={10}>
          <Stack spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                {inputName}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                {inputAvatar}
              </FormControl>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={4} sx={{ paddingBottom: '15px' }}>
          {avatarBlock}
        </Grid>
      </Stack>
    </Grid>
  );
}
export default ResposibleContent;
