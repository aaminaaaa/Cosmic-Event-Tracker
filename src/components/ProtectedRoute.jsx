import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show a loading spinner while checking the session
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-700">Loading...</p>
        </div>
    );
  }

  // If loading is false and no user exists, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child route
  return <Outlet />;
}