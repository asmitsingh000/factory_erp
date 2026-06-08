'use client';

import React, { useState } from 'react';

// ─── MOCK DATA (Backend API endpoints se replace hoga) ──────────────────────
const INITIAL_TEAM = [
  { id: 1, name: 'Rahul Sharma', role: 'Factory Supervisor', routes: ['workplace'], accessLevel: 'Current Working Month', addedOn: '2026-05-10' },
  { id: 2, name: 'Bikash Tamang', role: 'Inventory Manager', routes: ['stocks', 'balance'], accessLevel: 'All Access', addedOn: '2026-01-15' },
];

const AUDIT_LOGS = [
  { id: 101, user: 'Rahul Sharma', action: 'Updated Daily Production', route: 'workplace', details: 'Changed Shift A output from 450 to 480', timestamp: '2 mins ago' },
  { id: 102, user: 'Bikash Tamang', action: 'Modified Stock Entry', route: 'stocks', details: 'Added 50 units of Raw Material X', timestamp: '1 hour ago' },
  { id: 103, user: 'Rahul Sharma', action: 'Deleted Log', route: 'workplace', details: 'Removed duplicate entry for June 5', timestamp: 'Yesterday, 14:30' },
];

// ─── MAIN TEAM PAGE ──────────────────────────────────────────────────────────
export default function TeamManagementPage() {
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [logs] = useState(AUDIT_LOGS);

  // Access revoke karne ka handler
  const handleRevoke = (id) => {
    if (confirm("Are you sure you want to revoke access for this user?")) {
      setTeam(team.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-full flex flex-col space-y-6">
      
      {/* Page Header (Cleaned: Button is now handled beautifully by Navbar) */}
      <div className="pb-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Access & Team Management</h1>
        <p className="text-sm text-gray-400 mt-1">Control who can view and edit your factory logs.</p>
      </div>

      {/* Main Panel Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
        
        {/* ─── LEFT PANEL: GRANTED ACCESS LIST (LIST-WISE VIEW) ─── */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Delegations</h2>
          
          <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            {team.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No access granted to anyone yet. Use the top Navbar button to add team members.</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {team.map((member) => (
                  <div key={member.id} className="p-4 hover:bg-[#0f1524] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* User Profile Block */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-900/40 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20 shadow-inner shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-200">{member.name}</h3>
                        <p className="text-[11px] text-gray-500">{member.role} • Granted on {member.addedOn}</p>
                      </div>
                    </div>

                    {/* Access & Route Details */}
                    <div className="flex-1 max-w-sm">
                      <div className="flex gap-1.5 mb-1.5 flex-wrap">
                        {member.routes.map(r => (
                          <span key={r} className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-slate-800/60 text-gray-300 rounded border border-gray-700">
                            {r}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-emerald-400 font-medium bg-emerald-950/20 inline-block px-2 py-0.5 rounded border border-emerald-900/40">
                        Level: {member.accessLevel}
                      </p>
                    </div>

                    {/* Danger Zone Actions */}
                    <button 
                      onClick={() => handleRevoke(member.id)}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-md transition duration-150 self-end sm:self-center"
                    >
                      Revoke Access
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANEL: AUDIT HISTORY LOG (OWNER / DELEGATOR VIEW) ─── */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Audit History</h2>
            <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded font-medium">Secured Log</span>
          </div>

          <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-4 h-[520px] overflow-y-auto custom-scrollbar shadow-lg">
            {logs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center mt-10">No modifications recorded yet.</p>
            ) : (
              <div className="relative border-l border-gray-800 ml-3 space-y-6">
                {logs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    {/* Timeline Tracker Node */}
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[#0b0f19] border-2 border-indigo-500 rounded-full shadow-sm" />
                    
                    {/* Log Details Container */}
                    <div>
                      <p className="text-[10px] text-gray-500 font-medium mb-0.5">{log.timestamp}</p>
                      <p className="text-sm text-gray-200">
                        <span className="font-bold text-indigo-400">{log.user}</span> {log.action.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 bg-[#141b2d]/60 p-2 rounded-lg border border-gray-800/80 leading-relaxed">
                        {log.details}
                      </p>
                      <div className="mt-2 inline-block px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-slate-800 text-gray-400 rounded">
                        Target Route: {log.route}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}