import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

// Custom hook to easily access auth functions and state
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the initial user session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // 2. Listen for auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    // Functions to interact with Supabase Auth
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children once the initial session check is complete */}
      {!loading && children} 
    </AuthContext.Provider>
  );
}