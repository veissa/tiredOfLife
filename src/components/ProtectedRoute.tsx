import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'producer')[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const user = getCurrentUser();

  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 