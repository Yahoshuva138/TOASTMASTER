import React from 'react';
import { User, Mail, Shield, Building2, Calendar, Award } from 'lucide-react';
import { Profile, Task } from '../types/database.types';

interface UserProfileProps {
  currentUser: Profile;
  tasks: Task[];
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  tasks
}) => {
  const myTasks = tasks.filter(t => t.assignedMemberId === currentUser.id);
  const myCompleted = myTasks.filter(t => t.status === 'approved');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <div className="relative">
          <img 
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
            alt={currentUser.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#004165] shadow-md"
          />
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white p-1 border-2 border-[#F2DF74] shadow-md flex items-center justify-center">
            <img 
              src="/toastmasters-logo.svg" 
              alt="Toastmasters" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
            <h1 className="text-2xl font-black text-slate-900">{currentUser.fullName}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#772432] text-[#F2DF74] self-center sm:self-auto border border-[#932C3E]">
              {currentUser.systemRole === 'super_admin' ? '🛡️ Super Admin' : currentUser.clubRole}
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{currentUser.email}</span>
          </p>

          <p className="text-xs text-slate-600">
            SpeakUp Scaler Toastmasters Club • {currentUser.departmentName || 'General Membership'}
          </p>
        </div>
      </div>

      {/* Member Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400 block">Total Responsibilities</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">{myTasks.length}</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400 block">Verified Completed</span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">{myCompleted.length}</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-xs font-bold uppercase text-slate-400 block">Completion Rate</span>
          <span className="text-3xl font-black text-[#004165] mt-1 block">
            {myTasks.length > 0 ? Math.round((myCompleted.length / myTasks.length) * 100) : 0}%
          </span>
        </div>
      </div>

    </div>
  );
};
