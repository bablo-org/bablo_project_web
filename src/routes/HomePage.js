import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { auth, signOut } from "../services/firebase";

const HomePage = () => {
  const authContext = useContext(AuthContext)
  return (
    <button onClick={() => signOut(auth).then(() => {
      localStorage.removeItem('isAuth');
      authContext.setIsAuth(false);
    })}>Log out</button>
  );
};

export default HomePage;
