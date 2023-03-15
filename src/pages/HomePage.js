import { auth, signOut } from "../services/firebase";

const HomePage = ({onLogout}) => {
  return (
    <button onClick={() => signOut(auth).then(() => {
      localStorage.removeItem('isAuth');
      onLogout();
    })}>Log out</button>
  );
}

export default HomePage;
