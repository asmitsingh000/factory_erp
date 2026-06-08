'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BalanceContent() {
  const searchParams = useSearchParams();
  
  // URL parameters se context extract karna
  const currentMonth = searchParams.get('month') || 'June';
  const currentYear = searchParams.get('year') || '2026';
  const workType = searchParams.get('type') || 'working';

  // Logic: Agar mode 'records' hai, toh ye read-only ledger view hoga
  const isReadOnly = workType === 'records';

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fade-in w-full">
      
      {/* HEADER SECTION - Context aware status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0b0f19] p-4 rounded-xl border border-gray-800 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Balance Ledger</h1>
          <p className="text-xs text-gray-400 mt-1">
            Status: <span className="text-indigo-400 font-semibold">{currentMonth} {currentYear}</span> 
            {isReadOnly ? ' (Archive Mode)' : ' (Live Editing)'}
          </p>
        </div>

        {/* Global Navbar button ka equivalent logic yahan bhi handle ho sakta hai */}
        {/* {!isReadOnly && (
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-lg">
            + Add Ledger Entry
          </button>
        )} */}
      </div>

      {/* BALANCE TABLE - Responsive view */}
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-[#141b2d] text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Particulars</th>
                <th className="p-4 font-semibold">Credit/Debit</th>
                <th className="p-4 font-semibold">Balance</th>
                {!isReadOnly && <th className="p-4 font-semibold text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="text-gray-200 divide-y divide-gray-800">
              {/* Dummy row - tumhara data yahan map hoga */}
              <tr className="hover:bg-gray-800/20 transition">
                <td className="p-4 text-xs font-mono">06/07/2026</td>
                <td className="p-4 font-medium">Opening Balance Transfer</td>
                <td className="p-4 text-emerald-400">+50,000</td>
                <td className="p-4 font-bold text-white">50,000</td>
                {!isReadOnly && (
                  <td className="p-4 text-center">
                    <button className="text-xs text-gray-500 hover:text-indigo-400 underline">Edit</button>
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

export default function BalancePage() {
  return (
    <Suspense fallback={<div className="text-gray-400 p-6">Loading Balance Ledger...</div>}>
      <BalanceContent />
    </Suspense>
  );
}