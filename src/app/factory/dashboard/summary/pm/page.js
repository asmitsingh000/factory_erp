'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PMSummary() {
  const searchParams = useSearchParams();
  const searchModel = searchParams.get('searchModel');
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      { id: 1, name: "Carton Box A4", size: "14x12x10", purchase: 15000, consumed: 12300, prePack: 500, total: 3200 },
      { id: 2, name: "Stretch Film Roll", size: "500mm x 2Kg", purchase: 800, consumed: 650, prePack: 20, total: 170 }
    ]);
  }, []);

  useEffect(() => {
    if (searchModel && data.length > 0) {
      setTimeout(() => {
        const row = document.getElementById(`sum-row-${btoa(searchModel)}`);
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [searchModel, data]);

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-[#532805] text-white border-b border-gray-800 font-semibold uppercase text-xl tracking-wider">
            <th className="p-4 w-16">S.No</th>
            <th className="p-4">Material Name</th>
            <th className="p-4">Size Parameter</th>
            <th className="p-4 text-emerald-400">Total Purchased</th>
            <th className="p-4 text-rose-400">Consumed Ledger</th>
            <th className="p-4 text-amber-400">Pre-Packed Stock</th>
            <th className="p-4 text-indigo-400">Total In-Stock Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const isTarget = searchModel && row.name.trim().toLowerCase() === searchModel.trim().toLowerCase();
            return (
              <tr key={row.id} id={`sum-row-${btoa(row.name)}`} className={`border-b border-gray-800/60 transition-all duration-500 text-lg ${isTarget ? 'bg-amber-500/10 border-y-2 border-amber-500 animate-pulse' : 'hover:bg-gray-900/20'}`}>
                <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                <td className="p-4 font-bold text-gray-200">{row.name}</td>
                <td className="p-4 text-gray-400 font-mono text-base">{row.size}</td>
                <td className="p-4 text-emerald-400 font-mono">{row.purchase}</td>
                <td className="p-4 text-rose-400 font-mono">{row.consumed}</td>
                <td className="p-4 text-amber-400 font-mono">{row.prePack}</td>
                <td className="p-4 text-indigo-300 font-bold font-mono">{row.total} Pcs</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}