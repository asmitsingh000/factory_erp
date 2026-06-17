'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function RawMaterialsSummary() {
  const searchParams = useSearchParams();
  const searchModel = searchParams.get('searchModel');
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      { id: 1, name: "PP Granules Virgin", purchased: 25000, consumed: 18500, sales: 2000, total: 4500 },
      { id: 2, name: "HDPE Black Masterbatch", purchased: 5000, consumed: 4100, sales: 0, total: 900 }
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
            <th className="p-4">Raw Material Name</th>
            <th className="p-4 text-emerald-400">Purchased (Kg)</th>
            <th className="p-4 text-rose-400">Consumed (Kg)</th>
            <th className="p-4 text-blue-400">Direct Sales (Kg)</th>
            <th className="p-4 text-indigo-400">Total Net Stock Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const isTarget = searchModel && row.name.trim().toLowerCase() === searchModel.trim().toLowerCase();
            return (
              <tr key={row.id} id={`sum-row-${btoa(row.name)}`} className={`border-b border-gray-800/60 transition-all duration-500 text-lg ${isTarget ? 'bg-amber-500/10 border-y-2 border-amber-500 animate-pulse' : 'hover:bg-gray-900/20'}`}>
                <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                <td className="p-4 font-bold text-gray-200">{row.name}</td>
                <td className="p-4 text-emerald-400 font-mono">{row.purchased}</td>
                <td className="p-4 text-rose-400 font-mono">{row.consumed}</td>
                <td className="p-4 text-blue-400 font-mono">{row.sales}</td>
                <td className="p-4 text-indigo-300 font-bold font-mono">{row.total} Kg</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}