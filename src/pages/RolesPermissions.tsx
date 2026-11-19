import React from 'react';
import { ShieldCheck, Lock, Check, X, ShieldAlert } from 'lucide-react';
import { RolePermission, Profile, UserSystemRole } from '../types/database.types';

interface RolesPermissionsProps {
  rolePermissions: RolePermission[];
  currentUser: Profile;
  onTogglePermission: (roleId: string, permissionKey: keyof RolePermission['permissions']) => void;
}

export const RolesPermissions: React.FC<RolesPermissionsProps> = ({
  rolePermissions,
  currentUser,
  onTogglePermission
}) => {
  const isSuperAdmin = currentUser.systemRole === 'super_admin';

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 text-lg">Super Admin Authorization Required</h3>
        <p className="text-xs text-slate-500 mt-1">
          Permission matrix configuration is strictly reserved for the Super Administrator.
        </p>
      </div>
    );
  }

  const permissionLabels: { key: keyof RolePermission['permissions']; label: string }[] = [
    { key: 'viewTasks', label: 'View Tasks' },
    { key: 'createTasks', label: 'Create Tasks' },
    { key: 'editTasks', label: 'Edit Tasks' },
    { key: 'deleteTasks', label: 'Delete Tasks' },
    { key: 'assignTasks', label: 'Assign Tasks' },
    { key: 'uploadEvidence', label: 'Upload Evidence' },
    { key: 'reviewSubmissions', label: 'Review Submissions' },
    { key: 'approveTasks', label: 'Approve Tasks' },
    { key: 'manageMembers', label: 'Manage Members' },
    { key: 'manageRoles', label: 'Manage Roles' },
    { key: 'viewReports', label: 'View Reports' },
    { key: 'manageSettings', label: 'Manage Settings' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
          <img 
            src="/toastmasters-logo.svg" 
            alt="Toastmasters" 
            className="w-full h-full object-contain" 
          />
        </div>
        <div>
          <div className="flex items-center space-x-2 text-[#004165] mb-0.5">
            <span className="text-xs font-bold uppercase tracking-wider">Security & RBAC Matrix</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Toastmasters Role-Based Permissions</h1>
          <p className="text-xs text-slate-500">
            Enforce server-side Row Level Security (RLS) constraints across all 9 Toastmasters leadership roles.
          </p>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#004165] text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3 sticky left-0 bg-[#004165] z-10">Permission Feature</th>
                {rolePermissions.map(rp => (
                  <th key={rp.id} className="px-3 py-3 text-center min-w-[90px]">
                    {rp.roleName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionLabels.map(({ key, label }) => (
                <tr key={key} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-bold text-slate-900 sticky left-0 bg-white z-10">
                    {label}
                  </td>
                  {rolePermissions.map(rp => {
                    const isGranted = rp.permissions[key];
                    const isSuperAdminRole = rp.role === 'super_admin';

                    return (
                      <td key={rp.id} className="px-3 py-3 text-center">
                        <button
                          disabled={isSuperAdminRole} // Cannot demote super admin core permissions
                          onClick={() => onTogglePermission(rp.id, key)}
                          className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition ${
                            isGranted 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                          } ${isSuperAdminRole ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                          title={`${rp.roleName}: ${label} is ${isGranted ? 'Enabled' : 'Disabled'}`}
                        >
                          {isGranted ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
