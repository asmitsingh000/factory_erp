'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SummaryContent() {
  const searchParams = useSearchParams();
  
  // URL params se time extract karenge, fallback ke liye default values
  const currentMonth = searchParams.get('month') || 'June';
  const currentYear = searchParams.get('year') || new Date().getFullYear();
  const isEditing = searchParams.get('edit') === 'true';

  // Summary mostly read-only hota hai, but layout consistency ke liye border add karenge agar edit mode on hai
  const editIndicatorClass = isEditing ? "border-2 border-dashed border-amber-500/40 relative" : "border border-gray-800";

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fade-in w-full max-w-full">
      
      {/* === HEADER TOOLBAR === */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0b0f19] p-4 rounded-xl border border-gray-800 shadow-sm gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold capitalize text-white flex items-center space-x-2">
            <span>Summary Module</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Showing consolidated records for <strong className="text-white">{currentMonth} {currentYear}</strong>
          </p>
        </div>
        
        <div className="flex space-x-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full bg-[#141b2d] border border-gray-700 text-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          {/* Export Button */}
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 shadow-md shrink-0">
            Export PDF
          </button>
        </div>
      </div>

      {/* === MAIN DATA TABLE === */}
      <div className={`bg-[#0b0f19] rounded-xl overflow-hidden shadow-xl ${editIndicatorClass}`}>
        
        {/* Optional Edit Badge for UI Consistency */}
        {isEditing && (
          <div className="absolute top-2 right-2 bg-amber-500/10 text-amber-500/80 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider z-10 border border-amber-500/20">
            Read-Only Snapshot
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#141b2d] border-b border-gray-800 text-gray-400">
              <tr>
                <th className="p-4 font-semibold w-16">S.No</th>
                <th className="p-4 font-semibold">Name (Item/Particulars)</th>
                <th className="p-4 font-semibold">Sold / Balance</th>
                <th className="p-4 font-semibold">Stock / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              
              {/* Item 1: Furniture Display */}
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">1</td>
                <td className="p-4 font-medium text-white">Model X-Furniture</td>
                <td className="p-4 text-emerald-400 font-semibold">+ 45 Units Sold</td>
                <td className="p-4 text-gray-400">15 in Stock</td>
              </tr>
              
              {/* Item 2: Labor Ledger Display */}
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">2</td>
                <td className="p-4 font-medium text-white">Labor Advance - Rajendra</td>
                <td className="p-4 text-red-400 font-semibold">- Rs. 5,000 Amount</td>
                <td className="p-4 text-gray-400">Advance for {currentMonth}</td>
              </tr>
              
              {/* Item 3: Gate Pass Display */}
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">3</td>
                <td className="p-4 font-medium text-white">Gate Pass GP-4590</td>
                <td className="p-4 text-emerald-400 font-semibold">+ Rs. 2,670 Received</td>
                <td className="p-4 text-gray-400">Cleared by Head Office</td>
              </tr>
              
              {/* Item 4: Packaging/Consumed Display */}
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">4</td>
                <td className="p-4 font-medium text-white">P.M (Carton Box A4)</td>
                <td className="p-4 text-indigo-400 font-semibold">800 Consumed</td>
                <td className="p-4 text-gray-400">400 in Stock</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}

// Global Next.js Wrapper with Suspense to prevent useSearchParams build errors
export default function SummaryPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center text-gray-500 font-medium h-full min-h-[400px]">
        Loading Summary Data...
      </div>
    }>
      <SummaryContent />
    </Suspense>
  );
}