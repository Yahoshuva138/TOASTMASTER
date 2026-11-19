import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Mail, 
  Clock, 
  AlertTriangle, 
  Check, 
  X, 
  UserCheck 
} from 'lucide-react';
import { Profile, UserSystemRole, Department, Task } from '../types/database.types';

interface MembersManagementProps {
  members: Profile[];
  departments: Department[];
  tasks: Task[];
  currentUser: Profile;
  onUpdateMemberRole: (memberId: string, newRole: UserSystemRole, newClubRole: string) => void;
  onUpdateMemberDepartment: (memberId: string, departmentId: string) => void;
  onToggleMemberActive: (memberId: string) => void;
  onAuthorizeNewEmail: (email: string, fullName: string, role: UserSystemRole, clubRole: string, departmentId: string) => void;
  onApprovePendingMember: (memberId: string, role: UserSystemRole, clubRole: string, departmentId: string) => void;
  onRejectPendingMember: (memberId: string) => void;
}

export const MembersManagement: React.FC<MembersManagementProps> = ({
  members,
  departments,
  tasks,
  currentUser,
  onUpdateMemberRole,
  onUpdateMemberDepartment,
  onToggleMemberActive,
  onAuthorizeNewEmail,
  onApprovePendingMember,
  onRejectPendingMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Member Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserSystemRole>('member');
  const [newDeptId, setNewDeptId] = useState(departments[0]?.id || 'dept-edu');
  const [error, setError] = useState('');

  // Per-pending request state for inline role assignment
  const [pendingRoleAssignments, setPendingRoleAssignments] = useState<Record<string, { role: UserSystemRole; deptId: string }>>({});

  const isSuperAdmin = currentUser.systemRole === 'super_admin';

  // Filter pending vs active members
  const pendingMembers = members.filter(m => m.accessStatus === 'pending');
  const activeMembers = members.filter(m => m.accessStatus !== 'pending');

  const filteredMembers = activeMembers.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.clubRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClubTitleForRole = (role: UserSystemRole): string => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'president': return 'Club President';
      case 'vpe': return 'Vice President Education';
      case 'vpm': return 'Vice President Membership';
      case 'vppr': return 'Vice President Public Relations';
      case 'secretary': return 'Secretary';
      case 'treasurer': return 'Treasurer';
      case 'saa': return 'Sergeant at Arms';
      default: return 'Club Member';
    }
  };

  const handleAuthorizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    const clubTitle = getClubTitleForRole(newRole);
    onAuthorizeNewEmail(
      newEmail.trim().toLowerCase(),
      newName.trim() || newEmail.split('@')[0].toUpperCase(),
      newRole,
      clubTitle,
      newDeptId
    );

    setNewEmail('');
    setNewName('');
    setIsAddModalOpen(false);
    setError('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
            <img 
              src="/toastmasters-logo.svg" 
              alt="Toastmasters" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[#004165] mb-0.5">
              <span className="text-xs font-bold uppercase tracking-wider">Access & Role Governance</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Toastmasters Members & Access Control</h1>
            <p className="text-xs text-slate-500">
              Authorize emails, assign leadership roles, and review pending member access requests
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
          />

          {isSuperAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#772432] hover:bg-[#932C3E] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1.5 flex-shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#F2DF74]" />
              <span>+ Authorize Email</span>
            </button>
          )}
        </div>
      </div>

      {/* PENDING ACCESS REQUESTS SECTION (Highlight when emails are awaiting admin approval) */}
      {isSuperAdmin && pendingMembers.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-900">
              <Clock className="w-5 h-5 text-amber-600 animate-spin" />
              <h3 className="font-bold text-sm">
                Pending Access Requests ({pendingMembers.length}) — Super Admin Approval Required
              </h3>
            </div>
            <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
              Action Required
            </span>
          </div>

          <p className="text-xs text-amber-800 leading-relaxed">
            The following individuals attempted to sign in with their Google/email accounts. Assign their club role and department to grant them access to SpeakUp Scaler records.
          </p>

          <div className="space-y-3">
            {pendingMembers.map(pending => {
              const assigned = pendingRoleAssignments[pending.id] || {
                role: 'member' as UserSystemRole,
                deptId: departments[0]?.id || 'dept-edu'
              };

              return (
                <div 
                  key={pending.id} 
                  className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-slate-900 block">{pending.fullName}</span>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{pending.email}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Requested: {new Date(pending.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Inline Role & Department Assignment */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Assign Role</label>
                      <select
                        value={assigned.role}
                        onChange={(e) => {
                          const r = e.target.value as UserSystemRole;
                          setPendingRoleAssignments(prev => ({
                            ...prev,
                            [pending.id]: { ...assigned, role: r }
                          }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-[#004165]"
                      >
                        <option value="member">Club Member</option>
                        <option value="president">Club President</option>
                        <option value="vpe">VP Education</option>
                        <option value="vpm">VP Membership</option>
                        <option value="vppr">VP Public Relations</option>
                        <option value="secretary">Secretary</option>
                        <option value="treasurer">Treasurer</option>
                        <option value="saa">Sergeant at Arms</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block">Assign Department</label>
                      <select
                        value={assigned.deptId}
                        onChange={(e) => {
                          setPendingRoleAssignments(prev => ({
                            ...prev,
                            [pending.id]: { ...assigned, deptId: e.target.value }
                          }));
                        }}
                        className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Approve Button */}
                    <button
                      onClick={() => {
                        const clubTitle = getClubTitleForRole(assigned.role);
                        onApprovePendingMember(pending.id, assigned.role, clubTitle, assigned.deptId);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition flex items-center space-x-1 mt-auto"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Grant Access</span>
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => onRejectPendingMember(pending.id)}
                      className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-bold transition mt-auto"
                      title="Decline access"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE MEMBERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#004165] text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Club & System Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Access Status</th>
                <th className="px-4 py-3 text-center">Assigned Tasks</th>
                <th className="px-4 py-3 text-center">Completed</th>
                {isSuperAdmin && <th className="px-4 py-3 text-right">Admin Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map(m => {
                const memberTasks = tasks.filter(t => t.assignedMemberId === m.id);
                const memberCompleted = memberTasks.filter(t => t.status === 'approved');

                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    
                    {/* Member Name & Email */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                          alt={m.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-[#F2DF74]"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{m.fullName}</span>
                          <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{m.email}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role (Editable by Super Admin) */}
                    <td className="px-4 py-3">
                      {isSuperAdmin && m.id !== currentUser.id ? (
                        <select
                          value={m.systemRole}
                          onChange={(e) => {
                            const newSysRole = e.target.value as UserSystemRole;
                            const clubTitle = getClubTitleForRole(newSysRole);
                            onUpdateMemberRole(m.id, newSysRole, clubTitle);
                          }}
                          className="px-2 py-1 text-xs border border-slate-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-[#004165]"
                        >
                          <option value="member">Club Member</option>
                          <option value="president">Club President</option>
                          <option value="vpe">VP Education</option>
                          <option value="vpm">VP Membership</option>
                          <option value="vppr">VP Public Relations</option>
                          <option value="secretary">Secretary</option>
                          <option value="treasurer">Treasurer</option>
                          <option value="saa">Sergeant at Arms</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          m.systemRole === 'super_admin' ? 'bg-[#772432] text-[#F2DF74]' :
                          m.systemRole === 'president' ? 'bg-amber-100 text-amber-900' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {m.clubRole}
                        </span>
                      )}
                    </td>

                    {/* Department (Editable by Super Admin) */}
                    <td className="px-4 py-3">
                      {isSuperAdmin && m.id !== currentUser.id ? (
                        <select
                          value={m.departmentId || ''}
                          onChange={(e) => onUpdateMemberDepartment(m.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none"
                        >
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-600">{m.departmentName || 'General Membership'}</span>
                      )}
                    </td>

                    {/* Access Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        m.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {m.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{m.isActive ? 'Access Granted' : 'Access Revoked'}</span>
                      </span>
                    </td>

                    {/* Task Counts */}
                    <td className="px-4 py-3 text-center font-bold text-slate-700">{memberTasks.length}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">{memberCompleted.length}</td>

                    {/* Admin Actions */}
                    {isSuperAdmin && (
                      <td className="px-4 py-3 text-right">
                        {m.id !== currentUser.id && (
                          <button
                            onClick={() => onToggleMemberActive(m.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                              m.isActive 
                                ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {m.isActive ? 'Revoke Access' : 'Grant Access'}
                          </button>
                        )}
                      </td>
                    )}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AUTHORIZE NEW EMAIL & ASSIGN ROLE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            
            <div className="px-6 py-4 bg-[#772432] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-[#F2DF74]" />
                <h3 className="font-bold text-base">Authorize New Email & Assign Role</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-300 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthorizeSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center space-x-2 border border-red-200">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address to Authorize *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. member@gmail.com or @scaler.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Member Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assign Leadership Role *
                </label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserSystemRole)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold focus:ring-2 focus:ring-[#004165] focus:outline-none"
                >
                  <option value="member">Club Member</option>
                  <option value="president">Club President</option>
                  <option value="vpe">Vice President Education</option>
                  <option value="vpm">Vice President Membership</option>
                  <option value="vppr">Vice President Public Relations</option>
                  <option value="secretary">Secretary</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="saa">Sergeant at Arms</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assign Committee Department
                </label>
                <select
                  value={newDeptId}
                  onChange={e => setNewDeptId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#772432] hover:bg-[#932C3E] text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  Grant Access & Assign Role
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
