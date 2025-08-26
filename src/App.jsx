import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import EventTracker from './pages/EventTracker';
import CompareGraph from './pages/CompareGraph';

export default function App() {
  const [selectedNeos, setSelectedNeos] = useState([]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route: Login Page */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes: Require Authentication */}
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/" 
              element={<EventTracker setSelectedNeos={setSelectedNeos} />} 
            />
            <Route 
              path="/compare" 
              element={<CompareGraph selectedNeos={selectedNeos} />} 
            />
          </Route>
          
          {/* Fallback for unknown routes */}
          <Route path="*" element={<div className="p-8 text-center text-xl text-gray-700">404 | Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
