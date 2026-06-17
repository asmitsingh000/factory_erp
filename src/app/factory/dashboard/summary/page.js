// //this is the page for the summery it is a frontend file its route is app/factory/dashboard/summery/page.js

// 'use client';

// import React, { Suspense, useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';

// function SummaryContent() {
//   const searchParams = useSearchParams();
  
//   // URL params se time extract karenge, fallback ke liye default values
//   const currentMonth = searchParams.get('month') || 'June';
//   const currentYear = searchParams.get('year') || new Date().getFullYear();
//   const isEditing = searchParams.get('edit') === 'true';

//   // --- BACKEND INTEGRATION STATES ---
//   const [summaryData, setSummaryData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   // API se data fetch karne ka function
//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         setLoading(true);
//         // Laravel backend route (Apne environment ke hisab se URL adjust kar lena)
//         const response = await fetch(`http://localhost:8000/api/factory/summary?month=${currentMonth}&year=${currentYear}&search=${searchQuery}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch summary data');
//         }
        
//         const data = await response.json();
//         setSummaryData(data);
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Bounce check/debounce laga sakte ho search par, abhi ke liye direct hook kiya hai
//     fetchSummary();
//   }, [currentMonth, currentYear, searchQuery]);

//   // Summary mostly read-only hota hai, but layout consistency ke liye border add karenge agar edit mode on hai
//   const editIndicatorClass = isEditing ? "border-2 border-dashed border-amber-500/40 relative" : "border border-gray-800";

//   // Dynamic conditional coloring matching the manager's aesthetic choices
//   const getSoldBalanceClass = (type, value) => {
//     if (type === 'sold' || type === 'received') return "text-emerald-400 font-semibold";
//     if (type === 'expense' || type === 'advance') return "text-red-400 font-semibold";
//     return "text-indigo-400 font-semibold"; // default / consumed
//   };

//   return (
//     <div className="flex-1 flex flex-col space-y-6 animate-fade-in w-full max-w-full">
      
//       {/* === HEADER TOOLBAR === */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0b0f19] p-4 rounded-xl border border-gray-800 shadow-sm gap-4 shrink-0">
//         <div>
//           <h1 className="text-4xl font-bold capitalize text-white flex items-center space-x-2">
//             <span>Summary Module</span>
//           </h1>
//           <p className="text-l text-gray-400 mt-1">
//             Showing consolidated records for <strong className="text-white">{currentMonth} {currentYear}</strong>
//           </p>
//         </div>
        
//         <div className="flex space-x-3 w-full md:w-auto">
//           {/* Search Bar */}
//           <div className="relative w-full md:w-64">
//             <input 
//               type="text" 
//               placeholder="Search records..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-[#141b2d] border border-gray-700 text-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition"
//             />
//           </div>
//           {/* Export Button */}
//           <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95 shadow-md shrink-0">
//             Export PDF
//           </button>
//         </div>
//       </div>

//       {/* === MAIN DATA TABLE === */}
//       <div className={`bg-[#0b0f19] rounded-xl overflow-hidden shadow-xl ${editIndicatorClass}`}>
        
//         {/* Optional Edit Badge for UI Consistency */}
//         {isEditing && (
//           <div className="absolute top-2 right-2 bg-amber-500/10 text-amber-500/80 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider z-10 border border-black-500/20">
//             Read-Only Snapshot
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className="bg-[#532805] border-b border-b-black text-white-400">
//               <tr className='border-b-black'>
//                 <th className="p-4 font-semibold w-16 text-2xl">S.No</th>
//                 <th className="p-4 font-semibold text-2xl">Name (Item/Particulars)</th>
//                 <th className="p-4 font-semibold text-2xl">Sold / Balance</th>
//                 <th className="p-4 font-semibold text-2xl">Stock / Remarks</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800 text-gray-200 text-xl">
              
//               {loading ? (
//                 <tr>
//                   <td colSpan="4" className="p-8 text-center text-gray-400">Loading summary data from backend...</td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan="4" className="p-8 text-center text-red-400">Error: {error}</td>
//                 </tr>
//               ) : summaryData.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="p-8 text-center text-gray-500">No records found for this period.</td>
//                 </tr>
//               ) : (
//                 summaryData.map((item, index) => (
//                   <tr key={item.id || index} className="hover:bg-gray-800/30 transition">
//                     <td className="p-4">{index + 1}</td>
//                     <td className="p-4 font-medium text-white">{item.name}</td>
//                     <td className={`p-4 ${getSoldBalanceClass(item.type, item.sold_balance)}`}>
//                       {item.sold_balance}
//                     </td>
//                     <td className="p-4 text-gray-400">{item.remarks}</td>
//                   </tr>
//                 ))
//               )}

//             </tbody>
//           </table>
//         </div>
//       </div>
      
//     </div>
//   );
// }

// // Global Next.js Wrapper with Suspense to prevent useSearchParams build errors
// export default function SummaryPage() {
//   return (
//     <Suspense fallback={
//       <div className="flex-1 flex items-center justify-center text-gray-500 font-medium h-full min-h-[400px]">
//         Loading Summary Data...
//       </div>
//     }>
//       <SummaryContent />
//     </Suspense>
//   );
// }

import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  redirect('/factory/dashboard/summary/furniture');
}