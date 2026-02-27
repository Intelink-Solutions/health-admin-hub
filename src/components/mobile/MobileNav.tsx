import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  Moon, 
  Sun, 
  LogOut, 
  Home, 
  Stethoscope,
  Building2,
  ShoppingBag,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  Video,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface BottomNavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
}

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const sharedNavItems: NavItem[] = [
    {
      label: 'Home',
      path: '/home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: 'Find Doctors',
      path: '/discover/doctors',
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      label: 'Hospitals',
      path: '/discover/hospitals',
      icon: <Building2 className="w-5 h-5" />,
    },
  ];

  const patientNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/user/dashboard',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Messages',
      path: '/chat',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: 'Services',
      path: '/marketplace/services',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      label: 'Telemedicine',
      path: '/telemedicine/consultation',
      icon: <Video className="w-5 h-5" />,
    },
  ];

  const providerNavItems: NavItem[] = [
    {
      label: 'Provider Dashboard',
      path: '/provider/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'My Appointments',
      path: '/provider/dashboard',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Messages',
      path: '/chat',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: 'Earnings',
      path: '/provider/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'Telemedicine',
      path: '/telemedicine/consultation',
      icon: <Video className="w-5 h-5" />,
    },
  ];

  const getVisibleNavItems = () => {
    if (user?.role === 'patient') {
      return [...sharedNavItems, ...patientNavItems];
    } else if (user?.role === 'provider') {
      return [...sharedNavItems, ...providerNavItems];
    }

    return [];
  };

  const shouldShowMobileNav = isAuthenticated && (user?.role === 'patient' || user?.role === 'provider');

  if (!shouldShowMobileNav) {
    return null;
  }

  const visibleNavItems = getVisibleNavItems();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const getSettingsPath = () => {
    if (user?.role === 'provider') {
      return '/provider/settings';
    }
    return '/user/settings';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;

    if (path === '/home') {
      return currentPath === '/home' || currentPath === '/';
    }

    if (path === '/user/dashboard') {
      return currentPath.startsWith('/user/');
    }

    if (path === '/provider/dashboard') {
      return currentPath.startsWith('/provider/');
    }

    if (path === '/marketplace/services') {
      return currentPath.startsWith('/marketplace/');
    }

    if (path === '/telemedicine/consultation') {
      return currentPath.startsWith('/telemedicine/');
    }

    return currentPath === path;
  };

  const bottomNavItems: BottomNavItem[] = user?.role === 'provider'
    ? [
        {
          label: 'Home',
          path: '/home',
          icon: <Home className="w-5 h-5" />,
        },
        {
          label: 'Dashboard',
          path: '/provider/dashboard',
          icon: <BarChart3 className="w-5 h-5" />,
        },
        {
          label: 'Telemed',
          path: '/telemedicine/consultation',
          icon: <Video className="w-5 h-5" />,
        },
        {
          label: 'Menu',
          icon: <Menu className="w-5 h-5" />,
          onClick: () => setIsOpen(true),
        },
      ]
    : [
        {
          label: 'Home',
          path: '/home',
          icon: <Home className="w-5 h-5" />,
        },
        {
          label: 'Services',
          path: '/marketplace/services',
          icon: <ShoppingBag className="w-5 h-5" />,
        },
        {
          label: 'Dashboard',
          path: '/user/dashboard',
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: 'Menu',
          icon: <Menu className="w-5 h-5" />,
          onClick: () => setIsOpen(true),
        },
      ];

  return (
    <div className="md:hidden">
      {/* Mobile Menu Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* Slide Out Drawer */}
        <SheetContent
          side="left"
          className="w-[86%] max-w-xs p-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left data-[state=open]:duration-300 data-[state=closed]:duration-200 h-full flex flex-col overflow-hidden"
        >
          <SheetHeader className="relative border-b border-slate-200 dark:border-slate-800 p-4 pb-3 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-15 dark:opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-500/20 dark:from-blue-500/10 dark:to-teal-400/10" />
            <div className="relative flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  BP
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white">BesaPlus</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Healthcare</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className="relative z-10 p-2 rounded-lg bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200 active:scale-95"
                aria-label="Toggle dark mode"
              >
                {mounted && (
                  theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )
                )}
              </button>
            </div>
          </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="flex min-h-full flex-col">
                  {/* User Profile Section (if authenticated) */}
                  {isAuthenticated && user && (
                    <div className="border-b border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10 border-2 border-blue-500">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-blue-500 text-white text-sm font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleNavigate(getSettingsPath())}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 text-xs border-slate-300 dark:border-slate-700"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Button>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <nav className="p-3 space-y-1">
                    {visibleNavItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavigate(item.path)}
                        style={{ animationDelay: `${index * 40}ms` }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 group animate-in fade-in-50 slide-in-from-left-2 ${
                          isActive(item.path)
                            ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        } active:scale-95`}
                      >
                        <span className={isActive(item.path) ? 'text-blue-600 dark:text-blue-400' : ''}>
                          {item.icon}
                        </span>
                        {item.label}
                        {isActive(item.path) && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                        )}
                      </button>
                    ))}
                  </nav>

                  {/* Auth Section */}
                  <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-2">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full justify-start gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-auto px-4 pb-4 pt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                    <p>BesaPlus v1.0.0</p>
                    <p className="text-[10px] mt-1">Your Healthcare Companion</p>
                  </div>
                </div>
              </div>
            </SheetContent>
      </Sheet>

      {/* Mobile Overlay Background */}
      {isOpen && <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 animate-in fade-in duration-200 md:hidden pointer-events-none" />}

      {/* Bottom Button Nav - Mobile Only (Authenticated Patient/Provider) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
        <div className="grid grid-cols-4 px-2 py-1.5">
          {bottomNavItems.map((item) => {
            const active = item.path ? isActive(item.path) : false;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.path) {
                    handleNavigate(item.path);
                    return;
                  }
                  item.onClick?.();
                }}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all duration-200 active:scale-95 ${
                  active || (item.label === 'Menu' && isOpen)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
