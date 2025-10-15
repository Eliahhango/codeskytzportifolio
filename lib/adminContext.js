import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AdminContext = createContext({
  isAdmin: false,
  isLoading: true,
});

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminSession = useCallback(() => {
    try {
      const token = sessionStorage.getItem('admin_token');
      if (token) {
        const payload = JSON.parse(atob(token));
        if (payload.exp > Date.now() && payload.admin) {
          setIsAdmin(true);
          setIsLoading(false);
          return true;
        } else {
          sessionStorage.removeItem('admin_token');
          setIsAdmin(false);
          setIsLoading(false);
        }
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    } catch (error) {
      sessionStorage.removeItem('admin_token');
      setIsAdmin(false);
      setIsLoading(false);
    }
    return false;
  }, []);

  useEffect(() => {
    // Check for admin session token on mount
    checkAdminSession();

    // Listen for storage changes (in case login happens in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'admin_token') {
        checkAdminSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAdminSession]);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);