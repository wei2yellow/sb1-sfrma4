import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Menu, LogOut, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const roleLabels: Record<string, string> = {
    'SUPER_ADMIN': '超級管理者',
    'ADMIN': '總管理者',
    'MANAGER': '管理者',
    'SERVICE_LEADER': '外場幹部',
    'BAR_LEADER': '內場幹部',
    'SERVICE': '外場人員',
    'BAR': '吧檯人員',
    'NEW_SERVICE': '外場新進人員',
    'NEW_BAR': '吧檯新進人員'
  };

  const isRootPath = location.pathname === '/';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-premium sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isRootPath && (
              <button
                onClick={() => navigate(-1)}
                className="md:hidden text-navy hover:text-navy/80 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-navy hover:text-navy/80 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
              <h1 className="text-xl font-serif tracking-wider text-navy hidden md:block">
                茶自點林口A9
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isSuperAdmin && user && (
              <div className="hidden md:block text-sm text-navy/80">
                {user.name} ({roleLabels[user.role]})
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="!p-2 md:!px-3"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline ml-2">登出</span>
            </Button>
          </div>
        </div>
      </header>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={cn(
        "max-w-7xl mx-auto px-4 py-6 md:py-8 transition-all duration-300",
        sidebarOpen && "md:pl-72"
      )}>
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/')}
            className={cn(
              "p-2 rounded-full",
              location.pathname === '/' ? "bg-navy/5 text-navy" : "text-gray-500"
            )}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </div>
  );
}