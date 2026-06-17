'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../../context/userContext'

// ─── TEAM ACCESS MODAL ──────────────────────────────────────────────────────
function AddAccessModal({ isOpen, onClose, onSave }) {
  const [searchName, setSearchName] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [accessLevel, setAccessLevel] = useState('Current Working Month');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchName) return alert("Please type a staff name.");
    onSave({ id: Date.now(), name: searchName, routes: selectedRoutes, accessLevel });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0b0f19] border border-gray-800 w-full max-w-md rounded-xl shadow-2xl p-5 text-white">
        <h2 className="text-lg font-bold mb-4">Grant Factory Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Staff Name..." 
            value={searchName} 
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded border border-gray-700 text-sm hover:bg-gray-800 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded bg-indigo-600 text-sm font-semibold hover:bg-indigo-500 transition">Grant</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN FACTORY NAVBAR ─────────────────────────────────────────────────────
export default function FactoryNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile = {} } = useUser();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const links = [
    { label: 'Dashboard', href: "/factory/dashboard" },
    { label: 'Team Access', href: "/factory/team" },
    { label: 'Production Calendar', href: "/factory/calender" },
  ];

  // Robust path string checks for both direct routes & layout wrappers
  let dynamicButtonText = '+ New Entry';
  const isTeamAction = pathname.startsWith('/factory/team');

  if (pathname.includes('/workplace/furniture')) {
    dynamicButtonText = '+ Log Production Entry';
  } else if (pathname.includes('/workplace/household')) {
    dynamicButtonText = '+ Log Production Entry';
  } else if (pathname.includes('/workplace/pm')) {
    dynamicButtonText = '+ Log Production Entry';
  } else if (pathname.includes('/balance')) {
    dynamicButtonText = '+ Add Ledger Entry';
  } else if (pathname.includes('/stocks')) {
    dynamicButtonText = '+ Update Stock';
  }

  const hideActionButtons = pathname.includes('/summary') || pathname.includes('/calender');

  const handleActionClick = (actionType) => {
    if (isTeamAction && actionType === 'primary') {
      setIsTeamModalOpen(true);
    } else {
      // clean push behavior
      router.push(`${pathname}?action=${actionType === 'primary' ? 'new' : 'edit'}`);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0b0f19] border-b border-gray-800 flex items-center justify-between px-6 h-16 text-white select-none w-full">
      <div className="flex items-center space-x-8">
        <Link href="/factory/dashboard" className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center bg-white shrink-0">
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

        <Link href="/account" className="flex items-center space-x-2 border border-gray-700 bg-indigo-950/40 pl-3 pr-2 py-1 rounded-full shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300 truncate max-w-[70px]">Factory</span>
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
            {profile.username ? profile.username.slice(0,2).toUpperCase() : "FC"}
          </div>
        </Link>
      </div>

      <AddAccessModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} onSave={(data) => console.log(data)} />
    </div>
  )
}