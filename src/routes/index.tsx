import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import AddTransactionPage from './AddTransactionPage';
import HistoryPage from './TransactionPage';
import SummaryPage from './SummaryPage';
import LoginPage from './LoginPage';
import AuthorizedLayout from '../layouts/AuthorizedLayout';
import UserProfilePage from './UserProfilePage';
import EmailConfirmationPage from './EmailConfirmationPage';
import HomePage from '../components/HomePage/HomePage';
import UserInfoPage from './UserInfoPage';
import ContactsPage from './ContactsPage';

export const PATHES = {
  LOGIN: '/login',
  ADD_TRANSACTION: '/add',
  HISTORY_HOME: {
    HOME: '/transactions',
    HISTORY_ACTUAL: 'actual',
    HISTORY_DECLINED: 'declined',
    HISTORY_COMPLETED: 'completed',
  },
  USER_INFO: '/user/:id',
  CONTACTS: '/contacts',
  SUMMARY: '/summary',
  PROFILE: '/profile',
  VERIFY_EMAIL: '/verify-email/*',
  HOME_PAGE: '/',
};
export type UserInfoParams = Record<'id', string>;

export default createBrowserRouter([
  {
    path: PATHES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHES.VERIFY_EMAIL,
    element: <EmailConfirmationPage />,
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
        path: PATHES.HISTORY_HOME.HOME,
        children: [
          {
            path: PATHES.HISTORY_HOME.HISTORY_ACTUAL,
            element: <HistoryPage />,
            index: true,
          },
          {
            path: PATHES.HISTORY_HOME.HISTORY_COMPLETED,
            element: <HistoryPage />,
          },
          {
            path: PATHES.HISTORY_HOME.HISTORY_DECLINED,
            element: <HistoryPage />,
          },
        ],
      },

      {
        path: PATHES.SUMMARY,
        element: <SummaryPage />,
      },
      {
        path: PATHES.PROFILE,
        element: <UserProfilePage />,
      },
      {
        path: PATHES.USER_INFO,
        element: <UserInfoPage />,
      },
      {
        path: PATHES.CONTACTS,
        element: <ContactsPage />,
      },
    ],
  },
]);
