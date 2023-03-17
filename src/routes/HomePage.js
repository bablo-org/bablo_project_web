import { useContext } from "react";
import Header from "../components/Header/Header";
import { AuthContext } from "../context/Auth";
import { auth, signOut } from "../services/firebase";

const HomePage = () => {
  const authContext = useContext(AuthContext)
  return (
    <Header/>
  );
};

export default HomePage;
