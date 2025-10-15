import { createContext, useContext, useEffect, useState } from 'react';

const AdminContext = createContext({
  isAdmin: false,
  isLoading: false,
});

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    // Check for admin session token on mount
    const checkAdminSession = () => {
      try {
        const token = sessionStorage.getItem('admin_token');
        if (token) {
          const payload = JSON.parse(atob(token));
          if (payload.exp > Date.now() && payload.admin) {
            setIsAdmin(true);
          } else {
            sessionStorage.removeItem('admin_token');
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        sessionStorage.removeItem('admin_token');
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

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
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);