import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('session')) || null;
    } catch {
      return null;
    }
  });

  const login = (data) => {
    localStorage.setItem('session', JSON.stringify(data));
    setSession(data);
  };
  const logout = () => {
    localStorage.removeItem('session');
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user: session?.user, token: session?.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
