import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  CreditCard,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Member } from '../../types';

export const MembersModule: React.FC = () => {
  const { members, language, setActiveMemberId, role } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const isHindi = language === 'hi';

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {isHindi ? 'समूह सदस्य दीदियां' : 'SHG Member Artisan Directory'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi
              ? '10 सशक्त ग्रामीण कारीगर महिलाएं · कौशल, दैनिक क्षमता और पारदर्शी वित्तीय रिकॉर्ड'
              : '10 registered rural women artisans · skills, capacity quotas, and lifetime earnings'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search member or craft skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:border-purple-600"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          return (
            <div
              key={member.id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 rounded-full object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-purple-100 text-purple-900 font-bold text-sm flex items-center justify-center">
                        {member.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">
                        {isHindi ? member.nameHindi : member.name}
                      </h3>
                      <span className="text-[11px] text-purple-700 font-medium">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {member.attendanceRate}% Active
                  </span>
                </div>

                {/* Skills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(isHindi ? member.skillsHindi : member.skills).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-stone-50 text-stone-600 px-2 py-0.5 rounded border border-stone-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Capacity & Workload Info */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-center text-xs">
                  <div className="p-2 rounded-lg bg-stone-50">
                    <div className="text-[10px] text-stone-400">Daily Cap</div>
                    <div className="font-bold font-mono text-stone-900 mt-0.5">{member.dailyCapacity}/day</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50">
                    <div className="text-[10px] text-stone-400">Active Load</div>
                    <div className="font-bold font-mono text-purple-900 mt-0.5">{member.currentWorkload} units</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50">
                    <div className="text-[10px] text-stone-400">Available</div>
                    <div className="font-bold font-mono text-emerald-700 mt-0.5">{member.availableCapacity}/day</div>
                  </div>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs space-y-1">
                <div className="flex justify-between text-stone-500">
                  <span>Agreed Piece Rate</span>
                  <span className="font-mono font-semibold text-stone-800">₹{member.agreedPieceRate}/pc</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Pending Payout</span>
                  <span className="font-mono font-bold text-amber-800">₹{member.pendingBalance}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 pt-1 font-mono">
                  <CreditCard className="h-3 w-3" />
                  <span>{member.bankAccountAlias}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
