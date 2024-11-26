import { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from '../types/permissions';

interface PermissionGateProps {
  children: ReactNode;
  permission: Permission | Permission[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

export function PermissionGate({
  children,
  permission,
  fallback = null,
  requireAll = false
}: PermissionGateProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission)
    : hasPermission(permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}