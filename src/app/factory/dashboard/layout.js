// this is the parent layout for the sub-routes of the FurniturePage

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
// import FurniturePage from './workplace/furniture/page'

const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

function DashboardLayoutContent({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [systemDate, setSystemDate] = useState({ month: 'June', year: '2026' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const now = new Date();
    const currentMonthName = MONTHS_LIST[now.getMonth()];
    const currentYearString = String(now.getFullYear());
    
    setSystemDate({ month: currentMonthName, year: currentYearString });
    setMounted(true);
  }, []);

  const currentActiveMonth = searchParams.get('month') || systemDate.month;
  const currentActiveYear = searchParams.get('year') || systemDate.year;
  const workType = searchParams.get('type') || 'working'; 

  const getCurrentRouteLabel = () => {
    const segments = pathname.split('/');
    const currentSegment = segments[segments.length - 1]; 
    
    switch (currentSegment) {
      case 'summary':   return 'Summary Metrics';
      case "workplace": return 'Daily Production';
      case 'balance':   return 'Ledger Balance';
      case 'stocks':    return 'Stock Inventories';
      default:          return 'Daily Production';
    }
  };

  const [isWorkingOpen, setIsWorkingOpen] = useState(true);
  const [isRecordsOpen, setIsRecordsOpen] = useState(true);
  const [isPreviousOpen, setIsPreviousOpen] = useState(false);
  const [yearSearchQuery, setYearSearchQuery] = useState('');
  const [selectedArchivedYear, setSelectedArchivedYear] = useState(null);

  const ARCHIVED_YEARS_POOL = ['2025', '2024', '2023', '2022', '2021', '2020'];

  const filteredArchivedYears = ARCHIVED_YEARS_POOL.filter(yr => 
    yr.includes(yearSearchQuery.trim())
  );

  const handleTimeNavigation = (month, year, type) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', month);
    params.set('year', year);
    params.set('type', type);
    router.push(`${pathname}?${params.toString()}`);
  };

  if (!mounted) {
    return <div className="h-full bg-[#060913] flex items-center justify-center text-gray-500 text-xs">Loading system parameters...</div>;
  }

  return (
    // Changed h-screen to h-full to prevent overlapping with parent Navbar/Footer
    <div className="flex h-full w-full bg-[#060913] text-white overflow-hidden flex-col md:flex-row relative">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0b0f19] border-b border-gray-800 shrink-0 z-50">
        <span className="font-bold text-sm text-white-400"> Factory Dashboard</span>
        <select 
          value={`${currentActiveMonth}-${currentActiveYear}-${workType}`}
          onChange={(e) => {
            const [m, y, t] = e.target.value.split('-');
            handleTimeNavigation(m, y, t);
          }}
          className="bg-[#141b2d] border border-gray-700 text-xs rounded p-1.5 focus:outline-none"
        >
          <option value={`${systemDate.month}-${systemDate.year}-working`}>Current Work ({systemDate.month})</option>
          {MONTHS_LIST.map(m => (
            <option key={m} value={`${m}-2026-records`}>2026 - {m}</option>
          ))}
          <option value="December-2025-records">2025 Records</option>
        </select>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 shrink-0 bg-[#0b0f19] border-r border-gray-800 flex-col h-full select-none z-10">
        
        <div className="p-4 space-y-1.5 border-b border-gray-800 shrink-0">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Modules</h2>
          {['summary', 'workplace', 'balance', 'stocks'].map((mod) => {
            const targetPath = `/factory/dashboard/${mod}`;
            const isActive = pathname === targetPath;
            return (
              <Link 
                key={mod}
                href={`${targetPath}?month=${currentActiveMonth}&year=${currentActiveYear}&type=${workType}`}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-indigo-600/10 text-white-400 border border-indigo-500/30 shadow-sm text-l' 
                    : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'
                }`}
              >
                <span className="capitalize">{mod}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Scroll Container - Flex-1 automatically handles height calculation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-2">Time Period</h2>

          {/* Currently Working */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsWorkingOpen(!isWorkingOpen)}
              className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition shadow-md"
            >
              <span className="truncate">Currently Working</span>
              <span className={`text-[10px] transition-transform duration-200 ${isWorkingOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isWorkingOpen && (
              <div className="pl-2 pr-1 pt-1 space-y-1">
                <button 
                  onClick={() => handleTimeNavigation(systemDate.month, systemDate.year, 'working')}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold transition truncate ${
                    workType === 'working' ? 'bg-gray-800 text-blue-400 border-l-2 border-blue-500' : 'text-gray-400 hover:bg-gray-800/40'
                  }`}
                >
                  {getCurrentRouteLabel()} ({systemDate.month} {systemDate.year})
                </button>
              </div>
            )}
          </div>

          {/* 2026-Records */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsRecordsOpen(!isRecordsOpen)}
              className="w-full flex items-center justify-between bg-[#141b2d] hover:bg-[#1a233a] border border-gray-800 text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              <span>2026-Records</span>
              <span className={`text-[10px] transition-transform duration-200 ${isRecordsOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isRecordsOpen && (
              <div className="pl-3 pt-1 max-h-40 overflow-y-auto border-l border-gray-800 space-y-0.5 custom-scrollbar">
                {MONTHS_LIST.map((month) => {
                  const isCurrentSelection = currentActiveMonth === month && currentActiveYear === '2026' && workType === 'records';
                  const isSystemLiveMonth = systemDate.month === month && systemDate.year === '2026';

                  return (
                    <button
                      key={month}
                      onClick={() => handleTimeNavigation(month, '2026', 'records')}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition flex items-center justify-between ${
                        isCurrentSelection 
                          ? 'text-indigo-400 bg-indigo-950/40 font-bold border-r-2 border-indigo-500' 
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/20'
                      }`}
                    >
                      <span>{month}</span>
                      {isSystemLiveMonth && (
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-normal border border-emerald-500/20">Live</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Previous Years */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsPreviousOpen(!isPreviousOpen)}
              className="w-full flex items-center justify-between bg-[#141b2d] hover:bg-[#1a233a] border border-gray-800 text-gray-300 px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              <span>Previous Years</span>
              <span className={`text-[10px] transition-transform duration-200 ${isPreviousOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isPreviousOpen && (
              <div className="p-2 bg-[#080c14] border border-gray-800/60 rounded-md space-y-2 mt-1">
                <input 
                  type="text"
                  placeholder="🔍 Search year..."
                  value={yearSearchQuery}
                  onChange={(e) => setYearSearchQuery(e.target.value)}
                  className="w-full bg-[#111724] border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition"
                />

                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                  {filteredArchivedYears.length === 0 ? (
                    <div className="text-[11px] text-gray-500 text-center py-2">No record logs found</div>
                  ) : (
                    filteredArchivedYears.map(yr => {
                      const isYearSelected = selectedArchivedYear === yr;
                      return (
                        <div key={yr} className="space-y-1">
                          <button
                            onClick={() => setSelectedArchivedYear(isYearSelected ? null : yr)}
                            className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between transition ${
                              currentActiveYear === yr ? 'bg-indigo-950/20 text-indigo-400 font-bold' : 'text-gray-400 hover:bg-gray-800/40'
                            }`}
                          >
                            <span>Year {yr} Logbook</span>
                            <span className="text-[9px] text-gray-600">{isYearSelected ? '▲' : '▼'}</span>
                          </button>

                          {isYearSelected && (
                            <div className="pl-3 py-1 border-l border-gray-700 grid grid-cols-2 gap-1">
                              {MONTHS_LIST.slice(0, 6).map(m => (
                                <button
                                  key={m}
                                  onClick={() => handleTimeNavigation(m, yr, 'records')}
                                  className="text-left text-[10px] text-gray-500 hover:text-white truncate py-0.5"
                                >
                                  • {m.slice(0, 3)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#060913] relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {children}
        </div>
      </div>

    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<div className="h-full bg-[#060913] flex items-center justify-center text-white">Loading Structure...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}