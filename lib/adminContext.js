import { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../lib/firebaseClient';

const AdminContext = createContext({
  isAdmin: false,
  isLoading: true,
});

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // You can add additional checks here, like checking a custom claim
        // or checking against a list of admin emails
        const isAdminEmail = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        setIsAdmin(isAdminEmail);
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);