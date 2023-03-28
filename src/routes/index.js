import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";
import AddTransactionPage from "./AddTransactionPage";
import HistoryPage from "./HistoryPage";
import SummaryPage from "./SummaryPage";
import LoginPage from "./LoginPage";
import AuthorizedLayout from "../layouts/AuthorizedLayout";
import UserProfile from "../components/UserProfile/UserProfile";

export const PATHES = {
  LOGIN: "/login",
  ADD_TRANSACTION: "/add",
  HISTORY: "/history",
  SUMMARY: "/summary",
  PROFILE: "/profile"
};
export default createBrowserRouter([
  {
    path: PATHES.LOGIN,
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AuthorizedLayout />
      </ProtectedRoute>
    ),
    path: '/',
    children: [
      {
        index: true,
        element: <AddTransactionPage />,
      },
      {
        path: PATHES.ADD_TRANSACTION,
        element: <AddTransactionPage />,
      },
      {
        path: PATHES.HISTORY,
        element: <HistoryPage />,
      },
      {
        path: PATHES.SUMMARY,
        element: <SummaryPage />,
      },
      {
        path: PATHES.PROFILE,
        element: <UserProfile />
      }
    ],
  },
]);
