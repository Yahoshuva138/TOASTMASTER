import React, { useState } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, XCircle, Search, Mail, Phone } from 'lucide-react';
import { Profile, UserSystemRole, Department, Task } from '../types/database.types';

interface MembersManagementProps {
  members: Profile[];
  departments: Department[];
  tasks: Task[];
  currentUser: Profile;
  onUpdateMemberRole: (memberId: string, newRole: UserSystemRole, newClubRole: string) => void;
  onUpdateMemberDepartment: (memberId: string, departmentId: string) => void;
  onToggleMemberActive: (memberId: string) => void;
}

export const MembersManagement: React.FC<MembersManagementProps> = ({
  members,
  departments,
  tasks,
  currentUser,
  onUpdateMemberRole,
  onUpdateMemberDepartment,
  onToggleMemberActive
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isSuperAdmin = currentUser.systemRole === 'super_admin';

  const filteredMembers = members.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.clubRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Toastmasters Club Member Management</h1>
          <p className="text-xs text-slate-500">
            Manage roles, committee assignments, and account statuses for SpeakUp Scaler members
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
          />
        </div>
      </div>

      {/* Members Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#004165] text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Club & System Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Account Status</th>
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

                    {/* Role */}
                    <td className="px-4 py-3">
                      {isSuperAdmin && m.id !== currentUser.id ? (
                        <select
                          value={m.systemRole}
                          onChange={(e) => {
                            const newSysRole = e.target.value as UserSystemRole;
                            let clubTitle = 'Club Member';
                            if (newSysRole === 'president') clubTitle = 'Club President';
                            else if (newSysRole === 'vpe') clubTitle = 'Vice President Education';
                            else if (newSysRole === 'vpm') clubTitle = 'Vice President Membership';
                            else if (newSysRole === 'vppr') clubTitle = 'Vice President Public Relations';
                            else if (newSysRole === 'secretary') clubTitle = 'Secretary';
                            else if (newSysRole === 'treasurer') clubTitle = 'Treasurer';
                            else if (newSysRole === 'saa') clubTitle = 'Sergeant at Arms';
                            else if (newSysRole === 'super_admin') clubTitle = 'Super Admin';

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

                    {/* Department */}
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

                    {/* Account Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        m.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {m.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{m.isActive ? 'Active' : 'Deactivated'}</span>
                      </span>
                    </td>

                    {/* Task Counts */}
                    <td className="px-4 py-3 text-center font-bold text-slate-700">{memberTasks.length}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">{memberCompleted.length}</td>

                    {/* Action */}
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
                            {m.isActive ? 'Deactivate' : 'Reactivate'}
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

    </div>
  );
};
