'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function StocksLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const tabs = [
    { name: 'Furniture', path: '/factory/dashboard/stocks/furniture' },
    { name: 'Household', path: '/factory/dashboard/stocks/household' },
    { name: 'Packing Material', path: '/factory/dashboard/stocks/pm' },
    { name: 'Raw Materials', path: '/factory/dashboard/stocks/raw-materials' }
  ];

  // Indexing array to handle immediate dynamic redirect focus
  const globalStockIndex = [
    { name: "Chair - LM 102/103", target: "/factory/dashboard/stocks/furniture" },
    { name: "Table - TBL/R", target: "/factory/dashboard/stocks/furniture" },
    { name: "Bucket- 5 Ltr.", target: "/factory/dashboard/stocks/household" },
    { name: "Drum- 50 Ltr.", target: "/factory/dashboard/stocks/household" },
    { name: "Woven Sacks Stock", target: "/factory/dashboard/stocks/pm" },
    { name: "PPCP", target: "/factory/dashboard/stocks/raw-materials" },
    { name: "HD Inj.", target: "/factory/dashboard/stocks/raw-materials" }
  ];

  useEffect(() => {
    const activeSearchModel = searchParams.get('searchModel');
    if (activeSearchModel) setSearchQuery(activeSearchModel);
  }, [searchParams]);

  useEffect(() => {
    const clean = searchQuery.trim().toLowerCase().replace(/[\s-]/g, '');
    if (clean === '' || searchQuery === searchParams.get('searchModel')) {
      setSearchResults([]);
      return;
    }
    const matches = globalStockIndex.filter(item => 
      item.name.toLowerCase().replace(/[\s-]/g, '').includes(clean)
    );
    setSearchResults(matches);
  }, [searchQuery, searchParams]);

  useEffect(() => {
    function clickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div className="p-6 bg-[#080b11] min-h-screen text-white">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800/60 pb-5">
        <div>
          <h1 className="text-4xl font-bold tracking-wide">
            Factory Stock Register
            <span className="text-xs bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded ml-2 border border-indigo-900/50 font-medium">REALTIME INVENTORY</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Status: <span className="text-emerald-400 font-semibold">Live Operational Sync</span></p>
        </div>

        <div ref={searchRef} className="relative w-full sm:w-72">
          <input 
            type="text"
            placeholder="🔍 Search stock items/materials..."
            value={searchQuery}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111625] border border-gray-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-[#0b0f19] border border-gray-800 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50">
              {searchResults.map((item, idx) => (
                <button key={idx} onClick={() => { setSearchQuery(item.name); setShowDropdown(false); router.push(`${item.target}?searchModel=${encodeURIComponent(item.name)}`); }} className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-indigo-600/20 border-b border-gray-900/40 block truncate">
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex bg-[#111625] w-fit p-1 rounded-lg border border-gray-800 mb-6 overflow-x-auto max-w-full">
        {tabs.map((tab) => {
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