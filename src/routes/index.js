import {createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";

export const PATHES = {
  LOGIN: "/login",
  HOME: "/",
};
export default createBrowserRouter([
  {
    path: PATHES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHES.HOME,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
]);
