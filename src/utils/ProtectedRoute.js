import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { PATHES } from "../routes";

export default function ProtectedRoute({children}) {
  const authContext = useContext(AuthContext);

  if (!authContext.isAuth) {
    return (
      <Navigate to={PATHES.LOGIN} />
    )
  }

  return children;
}