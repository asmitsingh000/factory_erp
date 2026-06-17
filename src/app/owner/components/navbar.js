'use client'
import Link from 'next/link'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../../context/userContext'

export default function OwnerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile = {} } = useUser();

  const handleExport = () => {
    router.push(`${pathname}?action=export-analytics`);
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0b0f19] border-b border-gray-800 flex items-center justify-between px-6 h-16 text-white select-none w-full">
      <div className="flex items-center space-x-8">
        <Link href="/owner/monitor" className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center bg-white hover:border-indigo-500 transition shrink-0">
          <img src="/lotus.png" alt="Logo" className="object-contain p-1 w-full h-full" />
        </Link>

        <ul className="flex items-center space-x-2 text-sm font-medium">
          <li>
            <Link href="/owner/monitor" className={`px-3 py-1.5 block rounded-md transition ${pathname.startsWith('/owner/monitor') ? 'bg-black text-indigo-400 font-semibold border border-indigo-900/40' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'}`}>
              Global Monitor
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={handleExport} 
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-md active:scale-95 transition whitespace-nowrap"
        >
          Export Analytics
        </button>

        <Link href="/account" className="relative group flex items-center space-x-2 border border-gray-700 bg-indigo-950/40 pl-3 pr-2 py-1 rounded-full hover:border-indigo-500/50 transition shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300 truncate max-w-[70px]">Owner</span>
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
            {profile.username ? profile.username.slice(0,2).toUpperCase() : "OW"}
          </div>
        </Link>
      </div>
    </div>
  )
}