import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], userType }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If userType is provided, check user type
  if (userType) {
    if (user?.usertype !== userType) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  } 
  // If allowedRoles is provided and not empty, check roles
  else if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => 
      role === user?.role || role === user?.usertype
    );

    if (!hasRequiredRole) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 