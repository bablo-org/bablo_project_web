import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import AddTransactionPage from './AddTransactionPage';
import HistoryPage from './HistoryPage';
import SummaryPage from './SummaryPage';
import LoginPage from './LoginPage';
import AuthorizedLayout from '../layouts/AuthorizedLayout';
import UserProfilePage from './UserProfilePage';
import HomePage from '../components/HomePage/HomePage';

export const PATHES = {
  LOGIN: '/login',
  ADD_TRANSACTION: '/add',
  HISTORY_ACTUAL: '/actual',
  HISTORY_DECLINED: '/declined',
  HISTORY_COMPLETED: '/completed',
  SUMMARY: '/summary',
  PROFILE: '/profile',
  HOME_PAGE: '/',
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
        element: <HomePage />,
      },
      {
        path: PATHES.ADD_TRANSACTION,
        element: <AddTransactionPage />,
      },
      {
        path: PATHES.HISTORY_ACTUAL,
        element: <HistoryPage />,
      },
      {
        path: PATHES.HISTORY_COMPLETED,
        element: <HistoryPage />,
      },
      {
        path: PATHES.HISTORY_DECLINED,
        element: <HistoryPage />,
      },
      {
        path: PATHES.SUMMARY,
        element: <SummaryPage />,
      },
      {
        path: PATHES.PROFILE,
        element: <UserProfilePage />,
      },
    ],
  },
]);
