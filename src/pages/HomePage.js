import { auth, signOut } from "../services/firebase";

const HomePage = () => {
  return (
    <button onClick={() => signOut(auth)}>Log out</button>
  );
}

export default HomePage;
