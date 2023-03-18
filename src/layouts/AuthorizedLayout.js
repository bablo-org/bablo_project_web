import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";


const AuthorizedLayout = () => {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  );
};

export default AuthorizedLayout;
