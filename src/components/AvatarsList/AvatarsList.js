import { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import classes from './AvatarsList.module.css';

import useHomeApi from '../../hooks/useHomeApi';
import Spinner from '../Spinner/Spinner';


const AvatarsList = ({ onUserSelected }) => {
  const [selectedId, setSelectedId] = useState();
  const [selectedName, setSelectedName] = useState();
  const [users, setUsers] = useState([]);
  const { loading, error, getUsers } = useHomeApi();

  useEffect(() => {
    getUsers()
      .then(setUsers)
  }, [])

  useEffect(() => {
    onUserSelected(selectedName);
  }, [selectedId]);

  const nameList = users.map((user) => (
    <UserAvatar
      name={user.name}
      id={user.id}
      onSelected={setSelectedId}
      isActive={selectedId === user.id}
      isDisabled={selectedId && selectedId !== user.id}
      avatarsName={setSelectedName}
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
