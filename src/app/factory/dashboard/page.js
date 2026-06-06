'use client';

import React, { useState, useEffect, useMemo } from 'react';

// === DYNAMIC TIME GENERATORS ===
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function FactoryDashboard() {
  // 1. Dynamic Date Calculations
  const today = useMemo(() => new Date(), []);
  const CURRENT_YEAR = today.getFullYear();
  const CURRENT_MONTH_INDEX = today.getMonth();

  // Generate cyclic months for the current year (Current month at top)
  const currentYearMonths = useMemo(() => {
    return [
      ...MONTHS_FULL.slice(CURRENT_MONTH_INDEX),
      ...MONTHS_FULL.slice(0, CURRENT_MONTH_INDEX)
    ];
  }, [CURRENT_MONTH_INDEX]);

  // Generate previous years dynamically down to 2022
  const previousYears = useMemo(() => {
    const years = [];
    for (let y = CURRENT_YEAR - 1; y >= 2022; y--) {
      years.push(y);
    }
    return years;
  }, [CURRENT_YEAR]);

  // === STATE MANAGEMENT ===
  const [activeTab, setActiveTab] = useState('summary');
  const [activeSubTab, setActiveSubTab] = useState(''); 
  
  // 2. Time Filter States (Defaulting to actual current time)
  const [expandedYear, setExpandedYear] = useState(CURRENT_YEAR);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonths[0]);
  
  // State for wrapping previous years
  const [isPreviousExpanded, setIsPreviousExpanded] = useState(false);

  useEffect(() => {
    if (activeTab === 'summary') setActiveSubTab('');
    if (activeTab === 'workplace') setActiveSubTab('furniture');
    if (activeTab === 'balance') setActiveSubTab('factory_items');
    if (activeTab === 'stocks') setActiveSubTab('raw_materials');
  }, [activeTab]);

  // === RENDER HELPERS ===
  const renderSubTabs = () => {
    let tabs = [];
    if (activeTab === 'workplace') tabs = [{id: 'furniture', label: 'Furniture'}, {id: 'household', label: 'Household'}, {id: 'pm', label: 'P.M (Packaging)'}];
    if (activeTab === 'balance') tabs = [{id: 'factory_items', label: 'Factory Items (Gate Pass)'}, {id: 'labor', label: 'Labor / Staff Advances'}];
    if (activeTab === 'stocks') tabs = [{id: 'raw_materials', label: 'Raw Materials'}, {id: 'pm', label: 'P.M'}, {id: 'furniture', label: 'Furniture'}, {id: 'household', label: 'Household'}];

    if (tabs.length === 0) return null;

    return (
      <div className="flex space-x-2 mb-6 p-1 bg-[#141b2d] rounded-lg w-max border border-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  // === DYNAMIC TABLE RENDERING ===
  const renderTable = () => {
    if (activeTab === 'summary') {
      return (
        <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl animate-fade-in">
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
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">1</td>
                <td className="p-4 font-medium">Model X-Furniture</td>
                <td className="p-4 text-emerald-400 font-semibold">+ 45 Units Sold</td>
                <td className="p-4">15 in Stock</td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">2</td>
                <td className="p-4 font-medium">Labor Advance - Rajendra</td>
                <td className="p-4 text-red-400 font-semibold">- $5,000 Amount</td>
                <td className="p-4 text-gray-400">Advance for June</td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">3</td>
                <td className="p-4 font-medium">Gate Pass GP-4590</td>
                <td className="p-4 text-emerald-400 font-semibold">+ $2,670 Received</td>
                <td className="p-4 text-gray-400">Cleared by Head Office</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'workplace') {
      return (
        <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl animate-fade-in">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#141b2d] border-b border-gray-800 text-gray-400">
              <tr>
                <th className="p-4 font-semibold w-16">S.No</th>
                <th className="p-4 font-semibold">Model No. / Name</th>
                <th className="p-4 font-semibold">Production</th>
                <th className="p-4 font-semibold text-indigo-400">{activeSubTab === 'pm' ? 'Consumed' : 'Sold'}</th>
                <th className="p-4 font-semibold">Stock Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">1</td>
                <td className="p-4 font-medium">{activeSubTab === 'pm' ? 'Carton Box A4' : 'Sofa Set 992'}</td>
                <td className="p-4">1200</td>
                <td className="p-4 text-indigo-400 font-semibold">800</td>
                <td className="p-4 font-bold text-gray-300">400</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'balance') {
      return (
        <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl animate-fade-in">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-gray-800 text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-3 border-r border-gray-800 w-12 text-center">S.No</th>
                <th className="p-3 border-r border-gray-800">Particulars</th>
                <th className="p-3 border-r border-gray-800 text-emerald-400">Cash Received</th>
                <th className="p-3 border-r border-gray-800 text-red-400">Expense Amount</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-2.5 border-r border-gray-800 text-center">1</td>
                <td className="p-2.5 border-r border-gray-800 font-medium">{activeSubTab === 'labor' ? 'ADVANCE DEPOSIT' : 'BILL NO.2562'}</td>
                <td className="p-2.5 border-r border-gray-800 text-emerald-400">{activeSubTab === 'labor' ? '700' : ''}</td>
                <td className="p-2.5 border-r border-gray-800 text-red-400">{activeSubTab === 'labor' ? '' : '400'}</td>
                <td className="p-2.5">{activeSubTab === 'labor' ? 'DULARI DEVI' : 'CITY RICKSHAW'}</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="p-2.5 border-r border-gray-800 text-center">2</td>
                <td className="p-2.5 border-r border-gray-800 font-medium">{activeSubTab === 'labor' ? 'CLEANER EXP.' : 'CASH DEPOSIT IN FACTORY'}</td>
                <td className="p-2.5 border-r border-gray-800 text-emerald-400">{activeSubTab === 'labor' ? '' : '50000'}</td>
                <td className="p-2.5 border-r border-gray-800 text-red-400">{activeSubTab === 'labor' ? '2100' : ''}</td>
                <td className="p-2.5">{activeSubTab === 'labor' ? 'DULARI DEVI' : 'HEAD OFFICE'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === 'stocks') {
      return (
        <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl animate-fade-in">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#141b2d] border-b border-gray-800 text-gray-400">
              <tr>
                <th className="p-4 font-semibold w-16">S.No</th>
                <th className="p-4 font-semibold">Items / Model No.</th>
                <th className="p-4 font-semibold">Sold</th>
                <th className="p-4 font-semibold">Production / Auto-Data</th>
                <th className="p-4 font-semibold text-emerald-400">Updated (New Arrivals)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              <tr className="hover:bg-gray-800/30 transition">
                <td className="p-4">1</td>
                <td className="p-4 font-medium">Wood Ply - A Grade</td>
                <td className="p-4 text-gray-500">-</td>
                <td className="p-4 text-gray-500">N/A (Raw Material)</td>
                <td className="p-4 text-emerald-400 font-bold">+ 500 Sheets</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };

  // Reusable custom scrollbar class logic (Tailwind arbitrary variants)
  const sleekScrollbar = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500";

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#060913] text-white overflow-hidden select-none">
      
      {/* === LEFT SIDEBAR NAVIGATION === */}
      <div className="w-64 bg-[#0b0f19] border-r border-gray-800 flex flex-col">
        
        {/* Main Modules */}
        <div className="p-4 space-y-2 border-b border-gray-800">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">Modules</h2>
          {[
            { id: 'summary', label: 'Summary' },
            { id: 'workplace', label: 'Workplace'},
            { id: 'balance', label: 'Balance' },
            { id: 'stocks', label: 'Stocks' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === item.id ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Time Navigation (Years & Months) */}
        <div className={`flex-1 overflow-y-auto p-4 pr-3 ${sleekScrollbar}`}>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 mb-3">Time Period</h2>
          
          {/* Current Year Accordion (Rolling Months) */}
          <div className="mb-2">
            <button 
              onClick={() => setExpandedYear(expandedYear === CURRENT_YEAR ? null : CURRENT_YEAR)}
              className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-bold transition ${
                expandedYear === CURRENT_YEAR ? 'text-white' : 'text-gray-400 hover:bg-gray-800/40'
              }`}
            >
              <span>{CURRENT_YEAR} (Current)</span>
              <span className="text-xs">{expandedYear === CURRENT_YEAR ? '▼' : '▶'}</span>
            </button>
            
            {expandedYear === CURRENT_YEAR && (
              // Naya logic yahan add hua: max-h-[180px] aur custom scrollbar
              <div className={`ml-4 mt-1 space-y-1 border-l border-gray-800 pl-2 pr-1 animate-fade-in max-h-[180px] overflow-y-auto ${sleekScrollbar}`}>
                {currentYearMonths.map(month => (
                  <button
                    key={`current-${month}`}
                    onClick={() => { setSelectedMonth(month); setSelectedYear(CURRENT_YEAR); }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all ${
                      selectedMonth === month && selectedYear === CURRENT_YEAR 
                      ? 'bg-indigo-600 text-white font-medium' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Previous Years Wrapper */}
          <div className="mb-2 mt-4">
            <button 
              onClick={() => setIsPreviousExpanded(!isPreviousExpanded)}
              className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm font-bold transition ${
                isPreviousExpanded ? 'text-white' : 'text-gray-400 hover:bg-gray-800/40'
              }`}
            >
              <span>Previous Years</span>
              <span className="text-xs">{isPreviousExpanded ? '▼' : '▶'}</span>
            </button>

            {isPreviousExpanded && (
              <div className="ml-2 mt-2 space-y-2 border-l border-gray-800 pl-2 animate-fade-in">
                {/* Previous Years Accordions (Normal Months Order) */}
                {previousYears.map(year => (
                  <div key={year} className="mb-1">
                    <button 
                      onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                      className={`w-full flex justify-between items-center px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        expandedYear === year ? 'text-gray-200' : 'text-gray-500 hover:bg-gray-800/40'
                      }`}
                    >
                      <span>{year}</span>
                      <span className="text-xs">{expandedYear === year ? '▼' : '▶'}</span>
                    </button>
                    
                    {expandedYear === year && (
                      // Naya logic yahan add hua: max-h-[180px] aur custom scrollbar
                      <div className={`ml-4 mt-1 space-y-1 border-l border-gray-800 pl-2 pr-1 animate-fade-in max-h-[180px] overflow-y-auto ${sleekScrollbar}`}>
                        {MONTHS_FULL.map(month => (
                          <button
                            key={`${year}-${month}`}
                            onClick={() => { setSelectedMonth(month); setSelectedYear(year); }}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all ${
                              selectedMonth === month && selectedYear === year 
                              ? 'bg-indigo-600 text-white font-medium' 
                              : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* === MAIN CONTENT WORKSPACE === */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-[#060913] relative">
        
        {/* Header Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-[#0b0f19] p-4 rounded-xl border border-gray-800 shadow-sm gap-4">
          <div>
            <h1 className="text-xl font-bold capitalize text-white flex items-center space-x-2">
              <span>{activeTab} Module</span>
              {activeSubTab && <span className="text-gray-600">/</span>}
              {activeSubTab && <span className="text-indigo-400">{activeSubTab.replace('_', ' ')}</span>}
            </h1>
            <p className="text-xs text-gray-400 mt-1">Showing records for <strong className="text-white">{selectedMonth} {selectedYear}</strong></p>
          </div>
          
          <div className="flex space-x-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search records..." 
                className="w-full bg-[#141b2d] border border-gray-700 text-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 shadow-md">
              Export PDF
            </button>
          </div>
        </div>

        {/* Dynamic Sub Tabs Row */}
        {renderSubTabs()}

        {/* Render the specific table based on state */}
        <div className="flex-1">
          {renderTable()}
        </div>

      </div>
    </div>
  );
}