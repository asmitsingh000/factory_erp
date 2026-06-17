'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function WorkplaceLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Core metrics counters states
  const [totalProduced, setTotalProduced] = useState(0);
  const [machineTotals, setMachineTotals] = useState({});

  // Route indicator extraction ('furniture' or 'household')
  const currentSegment = pathname.split('/').pop() || 'furniture';

  const tabs = [
    { name: 'Furniture', path: '/factory/dashboard/workplace/furniture' },
    { name: 'Household', path: '/factory/dashboard/workplace/household' }
  ];

  //constant time for the date 
  const currentMonth = searchParams.get('month') || 'June';
  const currentYear = searchParams.get('year') || '2026';

  // Global exhaustive items definitions mapping across child routes
  const globalProductionItems = [
    { name: "Chair - LM 102", target: "/factory/dashboard/workplace/furniture" },
    { name: "Chair - LM 103", target: "/factory/dashboard/workplace/furniture" },
    { name: "Chair - LM 201", target: "/factory/dashboard/workplace/furniture" },
    { name: "Table – TBL-R", target: "/factory/dashboard/workplace/furniture" },
    { name: "Stool – STL-R", target: "/factory/dashboard/workplace/furniture" },
    { name: "Pirka – PK-R", target: "/factory/dashboard/workplace/furniture" },
    { name: "Veg. Crate", target: "/factory/dashboard/workplace/furniture" },
    {name: "Chair - LM 202",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 203",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 301",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 302",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 303",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 304",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 401",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 402",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 403",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 501",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 502",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 503",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 601",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 602",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 603",target: "/factory/dashboard/workplace/furniture" }, {name: "Chair - LM 701",target: "/factory/dashboard/workplace/furniture" },{ name:"Chair - LM 702",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 801",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 803",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 804",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 901",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 902",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 903",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 904",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1001",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1002",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1003",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 1004",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1101",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1102",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1103",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1201",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 1401",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1402",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1501",target: "/factory/dashboard/workplace/furniture" },{name: "Chair - LM 1502",target: "/factory/dashboard/workplace/furniture" },{ name:"Chair - LM 1601",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 1602",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 1603",target: "/factory/dashboard/workplace/furniture" }, {name:"Table – TBL-R-ST",target: "/factory/dashboard/workplace/furniture" }, {name:"Table – TBL-R",target: "/factory/dashboard/workplace/furniture" },{name: "Table – TBL-S-ST",target: "/factory/dashboard/workplace/furniture" },
    {name:"Table – TBL-S",target: "/factory/dashboard/workplace/furniture" }, {name:"Table – TBL-Y",target: "/factory/dashboard/workplace/furniture" },{ name:"Table – TBL-Y-N",target: "/factory/dashboard/workplace/furniture" },{name: "Stool – STL-R",target: "/factory/dashboard/workplace/furniture" }, {name:"Stool – STL-S",target: "/factory/dashboard/workplace/furniture" },
    {name:"R. Stool – RS-R",target: "/factory/dashboard/workplace/furniture" }, {name:"Pirka – PK-R",target: "/factory/dashboard/workplace/furniture" },{name: "Pirka - 1201",target: "/factory/dashboard/workplace/furniture" }, {name:"Big Pirka – BPK-R",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 51",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 52",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 53",target: "/factory/dashboard/workplace/furniture" },{name: "Chair - LM 61",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair – LM 62",target: "/factory/dashboard/workplace/furniture" }, {name:"Chair - LM 63",target: "/factory/dashboard/workplace/furniture" },
    {name:"Chair - LM 64",target: "/factory/dashboard/workplace/furniture" }, {name:"Fridge Stand",target: "/factory/dashboard/workplace/furniture" },{name: "M. Stool – M-STL-S",target: "/factory/dashboard/workplace/furniture" },{name: "Rattan MS – RMS-R",target: "/factory/dashboard/workplace/furniture" }, {name:"Rattan MS – RMS-S",target: "/factory/dashboard/workplace/furniture" },
    {name:"Cookie MS – CMS-R",target: "/factory/dashboard/workplace/furniture" }, {name:"T. Table – T-TBL-F",target: "/factory/dashboard/workplace/furniture" }, {name:"T. Table – T-TBL-S",target: "/factory/dashboard/workplace/furniture" }
  ];

  // ─── SIMPLE REAL-TIME METRICS CALCULATION LOGIC ───
  const fetchSegmentMetrics = async () => {
    try {
      const targetApi = `http://127.0.0.1:8000/api/factory/workplace/${currentSegment}`;
      const res = await fetch(`${targetApi}?t=${new Date().getTime()}`, { cache: 'no-store' });
      if (res.ok) {
        const logs = await res.json();

        let overallSum = 0;
        const machineMap = {};

        logs.forEach(log => {
          const qty = parseInt(log.quantity) || 0;
          overallSum += qty;

          if (log.machine_model) {
            machineMap[log.machine_model] = (machineMap[log.machine_model] || 0) + qty;
          }
        });

        setTotalProduced(overallSum);
        setMachineTotals(machineMap);
      }
    } catch (err) {
      console.error("Error gathering layout live counters:", err);
    }
  };

  useEffect(() => {
    fetchSegmentMetrics();
  }, [currentSegment, pathname, searchParams]);

  // Handle index searching mapping loops
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const matches = globalProductionItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(matches);
  }, [searchQuery]);

  useEffect(() => {
    function clickOutsideTracker(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", clickOutsideTracker);
    return () => document.removeEventListener("mousedown", clickOutsideTracker);
  }, []);

  const handleSearchSelection = (item) => {
    setSearchQuery(item.name);
    setShowDropdown(false);
    router.push(`${item.target}?searchModel=${encodeURIComponent(item.name)}`);
  };

  return (
    <div className="p-6 bg-[#070a13] min-h-screen text-gray-100">

      {/* HEADER SECTION: SIMPLE SIDE-BY-SIDE BOX LAYOUT */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-800 pb-4 mb-5 gap-4">

        {/* LEFT COMPONENT: WORKPLACE TITLE & SMALL INTERNAL SEARCH BAR */}
        <div className="flex flex-col gap-3 w-full md:max-w-xs">
          <div>
            <h1 className="text-4xl font-black text-white tracking-wider uppercase">Workplace Dashboard</h1>
            <p className="text-l text-gray-400">Data Ledger context status: <strong className="text-white">{currentMonth} {currentYear}</strong></p>
          </div>

          {/* SIMPLIFIED SMALL SEARCH COMPONENT DIRECTLY UNDER TITLE */}
          <div ref={searchRef} className="relative w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search specific item name..."
                className="w-full bg-[#111625] border border-gray-800 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); router.push(pathname); }}
                  className="absolute right-2.5 top-2 text-[10px] text-gray-400 hover:text-gray-200 font-bold"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* QUICK SELECTION DROPDOWN MENU */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-[#0e1422] border border-gray-800 rounded-lg shadow-2xl max-h-48 overflow-y-auto z-50 p-1">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchSelection(item)}
                    className="w-full text-left px-2.5 py-2 rounded text-xs font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all flex justify-between items-center"
                  >
                    <span>{item.name}</span>
                    <span className="text-[9px] bg-gray-900 px-1.5 py-0.5 rounded text-gray-500">
                      → {item.target.split('/').pop()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: CLEAN SIMPLE SUMMARIES (NO FANCY GRID, DIRECT DATA TEXT) */}
        <div className="text-left md:text-right bg-[#111625]/60 border border-gray-800/80 rounded-lg p-3 min-w-[200px] font-mono">
          <div className="text-sm font-black text-white border-b border-gray-800 pb-1 mb-1.5 uppercase">
            TOTAL :- <span className="text-emerald-400">{totalProduced.toLocaleString()}</span>
          </div>

          <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto text-[11px]">
            {Object.keys(machineTotals).length === 0 ? (
              <div className="text-gray-500 italic">No logs for active models</div>
            ) : (
              Object.entries(machineTotals).map(([machine, total]) => (
                <div key={machine} className="flex justify-between md:justify-end gap-4 text-gray-300">
                  <span className="text-gray-400 uppercase">{machine}:</span>
                  <span className="font-bold text-indigo-400">{total.toLocaleString()} pcs</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* HORIZONTAL LINE TABS NAVIGATION MODULE */}
      <div className="flex bg-[#111625] w-fit p-1 rounded-lg border border-gray-800 mb-5">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`px-4 py-1.5 text-xs font-bold rounded-md tracking-wider transition-all duration-150 ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              {tab.name.toUpperCase()}
            </Link>
          );
        })}
      </div>

      {/* CHILD PAGES SLATE ROUTER BLOCK */}
      <div className="relative">
        {children}
      </div>

    </div>
  );
}