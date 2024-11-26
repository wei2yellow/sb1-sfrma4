import { useAuthStore } from '../store/authStore';
import { Permission, ROLE_PERMISSIONS } from '../types/permissions';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions: user ? ROLE_PERMISSIONS[user.role] : [],
    role: user?.role
  };
}