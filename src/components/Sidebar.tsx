import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePermissions } from '../hooks/usePermissions';
import {
  ClipboardList,
  Clock,
  FileText,
  Coffee,
  Users,
  Megaphone,
  GraduationCap,
  Award,
  BarChart2,
  UserPlus,
  BookOpen,
  Lock,
  MessageSquare,
  Package,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
  roles?: string[];
}

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { hasPermission } = usePermissions();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      label: '主控台',
      path: '/',
      icon: <ClipboardList className="w-5 h-5" />,
      permission: 'VIEW_DASHBOARD'
    },
    {
      label: '外場時間表',
      path: '/service-schedule',
      icon: <Clock className="w-5 h-5" />,
      permission: 'VIEW_SCHEDULE'
    },
    {
      label: '庫存管理',
      path: '/inventory',
      icon: <Package className="w-5 h-5" />,
      permission: 'VIEW_INVENTORY'
    },
    {
      label: '應對情況',
      path: '/situations',
      icon: <MessageSquare className="w-5 h-5" />,
      permission: 'VIEW_SITUATIONS'
    },
    {
      label: '人員評優改進',
      path: '/evaluation',
      icon: <Award className="w-5 h-5" />,
      permission: 'VIEW_EVALUATION'
    },
    {
      label: '設立全體公告',
      path: '/announcements',
      icon: <Megaphone className="w-5 h-5" />,
      permission: 'VIEW_ANNOUNCEMENTS'
    },
    {
      label: '新進人員教學',
      path: '/new-staff-training',
      icon: <BookOpen className="w-5 h-5" />,
      permission: 'VIEW_TRAINING'
    },
    {
      label: '員工管理',
      path: '/accounts',
      icon: <UserPlus className="w-5 h-5" />,
      permission: 'MANAGE_USERS'
    }
  ];

  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
    menuItems.push(
      {
        label: '使用統計',
        path: '/statistics',
        icon: <BarChart2 className="w-5 h-5" />,
        permission: 'VIEW_STATISTICS'
      },
      {
        label: '職位權限說明',
        path: '/role-permissions',
        icon: <Lock className="w-5 h-5" />,
        permission: 'MANAGE_SYSTEM'
      }
    );
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-white shadow-premium transition-transform duration-300 ease-in-out z-50 transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-navy">功能選單</h2>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => (
              (!item.permission || hasPermission(item.permission)) && (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-gold/10 text-navy font-medium"
                      : "text-navy/80 hover:bg-gold/5"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              )
            ))}
          </div>
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}