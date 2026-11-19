import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Profile, UserSystemRole } from '../types/database.types';

interface RoleGuardProps {
  currentUser: Profile;
  allowedRoles?: UserSystemRole[];
  requireSuperAdmin?: boolean;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  currentUser,
  allowedRoles = [],
  requireSuperAdmin = false,
  children
}) => {
  if (requireSuperAdmin && currentUser.systemRole !== 'super_admin') {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-red-200 max-w-lg mx-auto mt-12 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Super Admin Access Required</h3>
        <p className="text-sm text-slate-600 mt-1">
          This section is restricted to the Super Administrator. Please contact TM Yahoshuva Kesaboyina for authorization.
        </p>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.systemRole)) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-amber-200 max-w-lg mx-auto mt-12 shadow-sm">
        <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Restricted Department Area</h3>
        <p className="text-sm text-slate-600 mt-1">
          You do not have executive permissions to perform this action.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
