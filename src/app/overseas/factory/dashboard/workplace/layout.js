'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function WorkplaceLayout({ children }) {
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Furniture', path: '/factory/dashboard/workplace/furniture' },
    { name: 'Household', path: '/factory/dashboard/workplace/household' },
    { name: 'PM', path: '/factory/dashboard/workplace/pm' }
  ];

  return (
    <div className="p-6 bg-[#080b11] min-h-screen text-white">
      {/* Workplace Shared Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white tracking-wide">Workplace Dashboard <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded ml-2 border border-emerald-900/50 font-medium">CURRENT</span></h1>
        <p className="text-l text-gray-400 mt-1">Data Ledger context status: <span className="font-semibold text-gray-200">June 2026</span></p>
        <button> </button>
      </div>

      {/* Shared Navigation Tabs */}
      <div className="flex bg-[#111625] w-fit p-1 rounded-lg border border-gray-800 mb-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link 
              key={tab.path} 
              href={tab.path}
              className={`px-5 py-1.5 text-xs font-bold rounded-md tracking-wider transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
            {tab.name.toUpperCase()}
            </Link>
          );
        })}
      </div>

      {/* Dynamic Sub-routes (furniture, household, pm) will render here */}
      <div>
        {children}
      </div>
    </div>
  )
}