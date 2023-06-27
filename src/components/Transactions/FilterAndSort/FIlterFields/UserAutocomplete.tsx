import { Autocomplete, Avatar, Box, Chip, TextField } from '@mui/material';
import { auth } from '../../../../services/firebase';
import User from '../../../../models/User';

function UserAutocomplete({
  users,
  onChange,
  selectedUsers,
}: {
  users: User[] | undefined;
  onChange: (user: User[]) => void;
  selectedUsers: User[];
}) {
  if (!users) {
    return null;
  }

  const filteredUsers = users.filter(
    (user) => user.id !== auth?.currentUser?.uid,
  );

  return (
    <Autocomplete
      multiple
      id='Dunkin-DoDicks'
      options={filteredUsers}
      getOptionLabel={(option) => option.name}
      defaultValue={[]}
      value={selectedUsers}
      onChange={(_, value) => {
        onChange(value);
      }}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip
            avatar={<Avatar alt='' src={option.avatar} />}
            variant='outlined'
            label={option.name}
            {...getTagProps({ index })}
          />
        ));
      }}
      renderOption={(props, option) => (
        <Box
          component='li'
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <Avatar
            sx={{ width: 24, height: 24, marginRight: 1 }}
            src={option.avatar}
            alt=''
          />
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Фильтр контактов'
          placeholder='Контакты'
        />
      )}
    />
  );
}

export default UserAutocomplete;
