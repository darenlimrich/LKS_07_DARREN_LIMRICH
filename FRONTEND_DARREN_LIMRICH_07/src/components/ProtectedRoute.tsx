import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role || '')) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/discover-games'} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
