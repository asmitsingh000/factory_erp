'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function SummaryLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // 5 New Core Summary Navigation Tabs
  const summaryTabs = [
    { name: 'Furniture', path: '/factory/dashboard/summary/furniture' },
    { name: 'Household', path: '/factory/dashboard/summary/household' },
    { name: 'PM', path: '/factory/dashboard/summary/pm' },
    { name: 'Raw Materials', path: '/factory/dashboard/summary/raw-materials' },
    { name: 'Balance', path: '/factory/dashboard/summary/balance' }
  ];

  // Master indexing list covering items across all sub-summary matrixes
  const globalSummaryItems = [
    { name: "Chair - LM 102", target: "/factory/dashboard/summary/furniture" },
    { name: "Chair - LM 103", target: "/factory/dashboard/summary/furniture" },
    { name: "Chair - LM 201", target: "/factory/dashboard/summary/furniture" },
    { name: "Table – TBL-R", target: "/factory/dashboard/summary/furniture" },
    { name: "Stool – STL-R", target: "/factory/dashboard/summary/furniture" },
    { name: "Pirka – PK-R", target: "/factory/dashboard/summary/furniture" },
    { name: "Veg. Crate", target: "/factory/dashboard/summary/furniture" },
    { name: "Fridge Stand", target: "/factory/dashboard/summary/furniture" },
    { name: "Bucket- 5 Ltr.", target: "/factory/dashboard/summary/household" },
    { name: "Drum- 50 Ltr.", target: "/factory/dashboard/summary/household" },
    { name: "SF-3000 - P", target: "/factory/dashboard/summary/household" },
    { name: "Carton Box A4", target: "/factory/dashboard/summary/pm" },
    { name: "Stretch Film Roll", target: "/factory/dashboard/summary/pm" },
    { name: "PP Granules Virgin", target: "/factory/dashboard/summary/raw-materials" },
    { name: "HDPE Black Masterbatch", target: "/factory/dashboard/summary/raw-materials" }
  ];

  useEffect(() => {
    const activeSearchModel = searchParams.get('searchModel');
    if (activeSearchModel) setSearchQuery(activeSearchModel);
  }, [searchParams]);

  useEffect(() => {
    const queryClean = searchQuery.trim().toLowerCase().replace(/[\s-]/g, '');
    if (queryClean === '' || searchQuery === searchParams.get('searchModel')) {
      setSearchResults([]);
      return;
    }
    const matches = globalSummaryItems.filter(item => 
      item.name.toLowerCase().replace(/[\s-]/g, '').includes(queryClean)
    );
    setSearchResults(matches);
  }, [searchQuery, searchParams]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (item) => {
    setSearchQuery(item.name);
    setShowDropdown(false);
    router.push(`${item.target}?searchModel=${encodeURIComponent(item.name)}`);
  };

  const handleExportPDF = () => {
    // alert(" Export Engine Triggered: Compiling current Ledger State into PDF format...");
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="p-6 bg-[#080b11] min-h-screen text-white">
      
      {/* Summary Section Master Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800/60 pb-5">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-wide">
            Factory Summary Ledger 
            <span className="text-xs bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded ml-2 border border-indigo-900/50 font-medium">STOCKS & BALANCE VIEW</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Audit Ledger context status: <span className="font-semibold text-gray-200">June 2026</span></p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Global Summary Omnibox Smart Search */}
          <div ref={searchRef} className="relative w-full sm:w-72 z-50">
            <input 
              type="text"
              placeholder="🔍 Search summary item models..."
              value={searchQuery}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111625] border border-gray-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); router.push(pathname); }} className="absolute right-3 top-2.5 text-gray-500 hover:text-white text-[10px]">✕</button>
            )}

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-[#0b0f19] border border-gray-800 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                {searchResults.map((item, index) => (
                  <button key={index} onClick={() => handleSelectResult(item)} className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-indigo-600/20 border-b border-gray-900/40 last:border-0 block truncate">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-[9px] text-gray-500 uppercase">Sector: {item.target.split('/').pop()}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Export PDF Utility Trigger */}
          <button 
            onClick={handleExportPDF}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Dynamic Summary Horizontal Tabs Navigation System */}
      <div className="flex bg-[#111625] w-fit p-1 rounded-lg border border-gray-800 mb-6 overflow-x-auto max-w-full">
        {summaryTabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link key={tab.path} href={tab.path} className={`px-4 py-1.5 text-xs font-bold rounded-md tracking-wider transition-all duration-200 whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
              {tab.name.toUpperCase()}
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  )
}