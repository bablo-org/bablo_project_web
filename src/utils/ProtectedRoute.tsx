import { Navigate } from 'react-router-dom';
import { PATHES } from '../routes';
import { useAppSelector } from '../store/hooks';

export default function ProtectedRoute({ children }: any) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to={PATHES.LOGIN} />;
  }

  if (!user?.emailVerified) {
    return <Navigate to={PATHES.VERIFY_EMAIL} />;
  }

  return children;
}
