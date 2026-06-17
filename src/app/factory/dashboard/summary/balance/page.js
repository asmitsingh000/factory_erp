'use client'
import React, { useState, useEffect } from 'react'

export default function BalanceSummary() {
  const [finance, setFinance] = useState({});

  useEffect(() => {
    setFinance({
      allocatedBudget: "Rs. 15,00,000",
      totalExpenses: "Rs. 11,42,500",
      revenueGenerated: "Rs. 18,90,000",
      netProfitMargin: "+Rs. 7,47,500",
      auditStatus: "PASSED"
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
      <div className="bg-[#111625] border border-gray-800 p-5 rounded-xl">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Allocated Capital Budget</div>
        <div className="text-3xl font-bold text-white mt-2 font-mono">{finance.allocatedBudget}</div>
      </div>
      <div className="bg-[#111625] border border-gray-800 p-5 rounded-xl">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Operational Expenses</div>
        <div className="text-3xl font-bold text-rose-400 mt-2 font-mono">{finance.totalExpenses}</div>
      </div>
      <div className="bg-[#111625] border border-gray-800 p-5 rounded-xl">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Sales Revenue</div>
        <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">{finance.revenueGenerated}</div>
      </div>
      <div className="bg-[#111625] border border-gray-800 p-5 rounded-xl border-l-4 border-l-indigo-500">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">Net Profit Balance</div>
        <div className="text-3xl font-bold text-indigo-300 mt-2 font-mono">{finance.netProfitMargin}</div>
      </div>
    </div>
  )
}