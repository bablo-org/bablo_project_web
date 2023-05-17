import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { PATHES } from '../routes';

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to={PATHES.LOGIN} />;
  }

  return children;
}
