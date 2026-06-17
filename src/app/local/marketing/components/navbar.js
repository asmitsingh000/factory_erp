'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@/app/context/userContext'

// ─── MARKETING ACCESSIBLE MODAL ──────────────────────────────────────────────
function AddAccessModal({ isOpen, onClose, onSave }) {
  const [searchName, setSearchName] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [accessLevel, setAccessLevel] = useState('Current Working Month');

  if (!isOpen) return null;

  const toggleRoute = (route) => {
    setSelectedRoutes(prev => 
      prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchName || selectedRoutes.length === 0) return alert("Please select a user and at least one route.");
    
    onSave({
      id: Date.now(),
      name: searchName,
      role: 'Marketing Staff',
      routes: selectedRoutes,
      accessLevel: accessLevel,
      addedOn: new Date().toISOString().slice(0, 10)
    });
    
    setSearchName('');
    setSelectedRoutes([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0b0f19] border border-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#080b13]">
          <h2 className="text-lg font-bold text-white">Grant Marketing Access</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Search Marketing Staff</label>
            <input 
              type="text" 
              placeholder="Start typing name..." 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Marketing Routes</label>
            <div className="grid grid-cols-3 gap-2">
              {['sales', 'track', 'records'].map(route => (
                <button
                  key={route}
                  type="button"
                  onClick={() => toggleRoute(route)}
                  className={`py-2 px-1 text-xs font-medium rounded-lg border transition capitalize ${
                    selectedRoutes.includes(route) 
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                      : 'bg-[#141b2d] border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {route}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Timeframe Access Level</label>
            <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none">
              <option value="Current Working Month">Current Working Month Only</option>
              <option value="Previous Ledger">Previous Ledger</option>
              <option value="All Access">All Access</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition">Grant Access</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN MARKETING NAVBAR ───────────────────────────────────────────────────
export default function MarketingNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile = {} } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const links = [
    { label: 'Sales Overview', href: "/marketing/dashboard" },
    { label: 'Track', href: "/marketing/team" },
    { label: 'Delivery Calendar', href: "/marketing/calender" },
  ];

  let dynamicButtonText = '+ New Delivery';
  let currentActionId = 'new-delivery';

  if (pathname.startsWith('/marketing/team')) {
    dynamicButtonText = '+ Add Team';
    currentActionId = 'add-team';
  } else if (pathname.startsWith('/marketing/calender')) {
    dynamicButtonText = '+ New Event';
    currentActionId = 'new-event';
  }

  const hideActionButtons = pathname.includes('/summary') || pathname.includes('/calender');

  const handleActionClick = (actionType) => {
    if (actionType === 'primary') {
      if (currentActionId === 'add-team') {
        setIsModalOpen(true);
      } else {
        router.push(`${pathname}?action=${currentActionId}`);
      }
    } else if (actionType === 'modify') {
      router.push(`${pathname}?edit=true`);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0b0f19] border-b border-gray-800 flex items-center justify-between px-6 h-16 text-white select-none w-full">
      <div className="flex items-center space-x-8">
        <Link href="/marketing/dashboard" className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center bg-white hover:border-indigo-500 transition shrink-0">
          <img src="/lotus.png" alt="Logo" className="object-contain p-1 w-full h-full" />
        </Link>

        <ul className="flex items-center space-x-2 text-sm font-medium">
          {links.map((link, idx) => (
            <li key={idx}>
              <Link href={link.href} className={`px-3 py-1.5 block rounded-md transition ${pathname.startsWith(link.href) ? 'bg-black text-indigo-400 font-semibold border border-indigo-900/40' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        {!hideActionButtons && (
          <>
            <button onClick={() => handleActionClick('primary')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-md active:scale-95 transition whitespace-nowrap">
              {dynamicButtonText}
            </button>
            <button onClick={() => handleActionClick('modify')} className="bg-slate-800/80 hover:bg-slate-700 text-gray-200 border border-gray-700 px-4 py-1.5 rounded-md text-sm font-medium active:scale-95 transition whitespace-nowrap">
              Edit/Modify
            </button>
          </>
        )}

        <Link href="/account" className="relative group flex items-center space-x-2 border border-gray-700 bg-indigo-950/40 pl-3 pr-2 py-1 rounded-full hover:border-indigo-500/50 transition shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300 truncate max-w-[70px]">Marketing</span>
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
            {profile.username ? profile.username.slice(0,2).toUpperCase() : "MK"}
          </div>
        </Link>
      </div>

      <AddAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={(data) => console.log(data)} />
    </div>
  )
}