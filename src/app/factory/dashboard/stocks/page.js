'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function StocksContent() {
  const searchParams = useSearchParams();
  
  const currentMonth = searchParams.get('month') || 'June';
  const currentYear = searchParams.get('year') || '2026';
  const workType = searchParams.get('type') || 'working';

  const isReadOnly = workType === 'records';

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fade-in w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0b0f19] p-4 rounded-xl border border-gray-800 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Stock Inventory</h1>
          <p className="text-xs text-gray-400 mt-1">
            Managing raw materials and finished goods for <span className="text-indigo-400 font-semibold">{currentMonth} {currentYear}</span>
          </p>
        </div>

        {/* {!isReadOnly && (
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-lg">
            + Update Stock
          </button>
        )} */}
      </div>

      {/* STOCKS TABLE */}
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-[#141b2d] text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold">Item Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">In Stock</th>
                <th className="p-4 font-semibold">Status</th>
                {!isReadOnly && <th className="p-4 font-semibold text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="text-gray-200 divide-y divide-gray-800">
              {/* Row 1: Low Stock Example */}
              <tr className="hover:bg-gray-800/20 transition">
                <td className="p-4 font-medium text-white">Premium Walnut Wood</td>
                <td className="p-4 text-gray-400">Raw Material</td>
                <td className="p-4 font-bold text-red-400">12 Units</td>
                <td className="p-4">
                  <span className="bg-red-500/10 text-red-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Low Stock</span>
                </td>
                {!isReadOnly && (
                  <td className="p-4 text-center">
                    <button className="text-xs text-emerald-400 hover:underline">Restock</button>
                  </td>
                )}
              </tr>
              
              {/* Row 2: Healthy Stock */}
              <tr className="hover:bg-gray-800/20 transition">
                <td className="p-4 font-medium text-white">Steel Hinges 4-inch</td>
                <td className="p-4 text-gray-400">Hardware</td>
                <td className="p-4 font-bold text-emerald-400">450 Units</td>
                <td className="p-4">
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Healthy</span>
                </td>
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

export default function StocksPage() {
  return (
    <Suspense fallback={<div className="text-gray-400 p-6">Loading Inventory Stocks...</div>}>
      <StocksContent />
    </Suspense>
  );
}