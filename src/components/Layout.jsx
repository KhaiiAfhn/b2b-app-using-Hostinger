import React from 'react';
    import { Link, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Briefcase, Users, UserCircle, LogIn, LogOut, FolderHeart as HomeIcon, Search } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from '@/components/ui/use-toast';

    const Layout = ({ children }) => {
      const location = useLocation();
      const { currentUser, logout } = useAuth();
      const { toast } = useToast();

      const navItems = [
        { path: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
        ...(currentUser ? [
          { path: '/match', label: 'Discover', icon: <Search className="w-5 h-5" /> },
          { path: '/matches', label: 'My Matches', icon: <Users className="w-5 h-5" /> },
          { path: '/profile', label: 'Profile', icon: <UserCircle className="w-5 h-5" /> },
        ] : [
          { path: '/register', label: 'Register / Login', icon: <LogIn className="w-5 h-5" /> },
        ]),
      ];

      const handleLogout = () => {
        logout();
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
          variant: "default",
        });
      };

      return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100">
          <header className="sticky top-0 z-50 shadow-lg bg-slate-900/80 backdrop-blur-md">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Briefcase className="w-10 h-10 text-pink-500" />
                <h1 className="text-3xl font-bold gradient-text">B2B Connect</h1>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                    asChild
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:bg-pink-500/20 ${location.pathname === item.path ? 'bg-pink-500/30 text-pink-400' : 'text-gray-300 hover:text-pink-400'}`}
                  >
                    <Link to={item.path} className="flex items-center space-x-2">
                      {item.icon}
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  </Button>
                ))}
                {currentUser && (
                   <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:bg-red-500/20 text-gray-300 hover:text-red-400 flex items-center space-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                )}
              </div>
            </nav>
          </header>
          
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>

          <footer className="bg-slate-900/80 py-8 text-center text-gray-400">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} B2B Connect. All rights reserved.
              </p>
              <p className="text-xs mt-1">
                Connecting Businesses, One Swipe at a Time.
              </p>
            </div>
          </footer>
        </div>
      );
    };

    export default Layout;