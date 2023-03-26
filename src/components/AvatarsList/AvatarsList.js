import { useEffect, useState } from 'react';
import { auth } from '../../services/firebase';
import UserAvatar from '../UserAvatar/UserAvatar';
import classes from './AvatarsList.module.css';

import useHomeApi from '../../hooks/useHomeApi';
import Spinner from '../Spinner/Spinner';

const AvatarsList = ({ onUserSelected, currentUser }) => {
  const defaultUser = auth.currentUser.uid;
  const [selectedId, setSelectedId] = useState();
  const [users, setUsers] = useState([]);
  const { loading, error, getUsers } = useHomeApi();
  
  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    onUserSelected(selectedId);
  }, [selectedId]);

  const nameList = users.map((user) => (
    <UserAvatar
      key={user.id}
      name={user.name}
      id={user.id}
      onSelected={setSelectedId}
      isActive={selectedId === user.id}
      isDisabled={selectedId && selectedId !== user.id}
      isBlock={currentUser === user.id || currentUser && currentUser !== defaultUser && user.id !== defaultUser}
    />

  ));

  return (
    <div className={classes.avatarsContainer}>
      {loading ? <Spinner /> : nameList}
      {error && <div>Дрюс что-то сломал.</div>}
    </div>
  );
};

export default AvatarsList;
