import React from 'react';
import MobileNav from '../mobile/MobileNav';
import { useAuth } from '@/context/AuthContext';

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const showMobileNav = isAuthenticated && (user?.role === 'patient' || user?.role === 'provider');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Navigation - Fixed at top */}
      <MobileNav />

      {/* Page Content with padding for mobile nav */}
      <main className={`md:pt-0 ${showMobileNav ? 'pt-0 pb-20' : 'pt-0 pb-0'} transition-all duration-300 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
