'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function WorkplaceContent() {
  const searchParams = useSearchParams();
  
  // URL configurations hook interface
  const currentMonth = searchParams.get('month') || 'June';
  const currentYear = searchParams.get('year') || '2026';
  const workType = searchParams.get('type') || 'working';

  const [activeSubTab, setActiveSubTab] = useState('furniture');

  // Business Condition Logic: Agar mode records hai, toh layout elements read-only display denge
  const isReadOnly = workType === 'records';

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fade-in w-full max-w-full">
      
      {/* CORE STATUS INFOBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0b0f19] p-4 rounded-xl border border-gray-800 gap-4 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white">Workplace Dashboard</h1>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
              isReadOnly ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {isReadOnly ? ' Archived Logs' : 'current'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Data Ledger context status: <strong className="text-white">{currentMonth} {currentYear}</strong>
          </p>
        </div>

        {/* Action Button state toggles automatically based on parameters context */}
        {/* {!isReadOnly && (
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-lg active:scale-95">
            + Log Production Entry
          </button>
        )} */}
      </div>

      {/* SUB MODULE TRACKS CONTROL */}
      <div className="flex space-x-2 p-1 bg-[#141b2d] rounded-lg w-full sm:w-max border border-gray-800 overflow-x-auto shrink-0">
        {['furniture', 'household', 'pm'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeSubTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* MAIN DATA ARCHITECTURE INTERFACE GRID */}
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-[#141b2d] text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold w-16">S.No</th>
                <th className="p-4 font-semibold">Department Particulars</th>
                <th className="p-4 font-semibold">Quantity Status</th>
                <th className="p-4 font-semibold">System Audit Timestamp</th>
                {!isReadOnly && <th className="p-4 font-semibold text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-gray-200 divide-y divide-gray-800">
              <tr className="hover:bg-gray-800/10 transition">
                <td className="p-4">1</td>
                <td className="p-4 font-medium text-white capitalize">{activeSubTab} Core Operations Ledger</td>
                <td className="p-4 font-bold text-blue-400">4,850 Inventory Units</td>
                <td className="p-4 text-xs text-gray-400">Synced - {currentMonth} {currentYear}</td>
                {!isReadOnly && (
                  <td className="p-4 text-center">
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-700">
                      Modify
                    </button>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default function WorkplacePage() {
  return (
    <Suspense fallback={<div className="text-gray-400 p-6">Loading Dynamic Workspace Context...</div>}>
      <WorkplaceContent />
    </Suspense>
  );
}