import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { useEffect } from 'react';

export const Layout = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Skip header for auth pages
  const isAuthPage = location.pathname === '/' || 
                    location.pathname === '/login' || 
                    location.pathname === '/signup' || 
                    location.pathname === '/reset-password';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}; 