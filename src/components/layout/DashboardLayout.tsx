import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, LogOut, Home, LayoutDashboard, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl hidden sm:block">FoodBridge</span>
            </button>

            <div className="flex items-center gap-2 md:gap-4">
              <ThemeToggle />
              <div
                onClick={() => navigate('/profile')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted cursor-pointer hover:bg-muted/80 transition-colors border border-transparent hover:border-border"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.displayName}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${user?.role === 'donor'
                  ? 'bg-primary/20 text-primary dark:text-primary-foreground font-medium'
                  : 'bg-accent/20 text-accent dark:text-accent-foreground font-medium'
                  }`}>
                  {user?.role === 'donor' ? 'Donor' : 'NGO'}
                </span>
              </div>

              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} title="Profile" className="h-9 w-9 rounded-xl">
                <User className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-9 w-9 rounded-xl">
                <Home className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9 rounded-xl">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Page title */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user?.role === 'donor'
              ? 'bg-primary/10'
              : 'bg-accent/10'
              }`}>
              <LayoutDashboard className={`w-6 h-6 ${user?.role === 'donor' ? 'text-primary' : 'text-accent'
                }`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, {user?.displayName}
              </p>
            </div>
          </div>

          {children}
        </motion.div>
      </main>
    </div>
  );
};
