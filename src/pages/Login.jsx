import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const action = isSigningUp ? signUp : signIn;
    
    const { error } = await action(email, password);
    
    if (error) {
      alert(`Authentication Error: ${error.message}`);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 sm:p-0" style={{ backgroundImage: 'space-planet-science-night-generated-by-ai.jpg', backgroundSize: 'cover' }}>
      <div className="relative flex flex-col items-center ">
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto text-center p-6 bg-black bg-opacity-50 rounded-lg">
          
          <h2 className="text-2xl font-extrabold mb-6 text-white ">
            Cosmic Event Tracker <br/>{isSigningUp ? 'Sign Up' : 'Log In'}
          </h2>
          
          
          <div className="mb-2"> {}
            <input 
              id="email"
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2  bg-white text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
              required 
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <input 
              id="password"
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-500"
              required 
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-between items-center mb-4 text-sm">
            <button 
              type="submit" 
              className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-full hover:bg-gray-100 transition font-semibold"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'LOG IN'}
            </button>
           
          </div>

        </form>

        <p 
          className="mt-4 text-center text-sm text-white cursor-pointer hover:text-blue-600 transition"
          onClick={() => setIsSigningUp(!isSigningUp)}
        >
          {isSigningUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </p>

        <p className="mt-4 text-white text-xs text-center">
          Copyright © 2025 Cosmic Event Tracker. All rights reserved.
        </p>
         <footer className="mt-12 pt-10 font-extrabold border-t border-gray-700 text-center text-sm text-white">
          Developed by SYED AAMINA
        </footer>
      </div>
    </div>
  );
}