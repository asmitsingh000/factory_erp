// 'use client'
// import Link from 'next/link'
// import React, { useState } from 'react'
// import { usePathname, useRouter } from 'next/navigation'
// import { useUser } from '../context/userContext' 

// // ─── ADD MEMBER MODAL COMPONENT (Integrated in Navbar) ────────────────────────
// function AddAccessModal({ isOpen, onClose, onSave, currentRole }) {
//   const [searchName, setSearchName] = useState('');
//   const [selectedRoutes, setSelectedRoutes] = useState([]);
//   const [accessLevel, setAccessLevel] = useState('Current Working Month');

//   if (!isOpen) return null;

//   const toggleRoute = (route) => {
//     setSelectedRoutes(prev => 
//       prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route]
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!searchName || selectedRoutes.length === 0) return alert("Please select a user and at least one route.");
    
//     // Yahan API call aayegi future me. Abhi ke liye console/onSave callback call kar rahe hain
//     onSave({
//       id: Date.now(),
//       name: searchName,
//       role: `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Staff`,
//       routes: selectedRoutes,
//       accessLevel: accessLevel,
//       addedOn: new Date().toISOString().slice(0, 10)
//     });
    
//     setSearchName('');
//     setSelectedRoutes([]);
//     setAccessLevel('Current Working Month');
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//       <div className="bg-[#0b0f19] border border-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-down">
        
//         <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#080b13]">
//           <h2 className="text-lg font-bold text-white capitalize">Grant {currentRole} Access</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-white transition">✕</button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-5 space-y-5">
//           {/* User Search */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
//               Search Staff (Same Branch - {currentRole})
//             </label>
//             <input 
//               type="text" 
//               placeholder="Start typing name..." 
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//               className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
//             />
//             <p className="text-[10px] text-gray-500 mt-1">Backend will filter '{currentRole}' role employees automatically.</p>
//           </div>

//           {/* Route Access Selection */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Editable Routes Selection</label>
//             <div className="grid grid-cols-3 gap-2">
//               {/* Dynamic routes based on role */}
//               {(currentRole === 'factory' ? ['workplace', 'balance', 'stocks'] : ['sales', 'track', 'records']).map(route => (
//                 <button
//                   key={route}
//                   type="button"
//                   onClick={() => toggleRoute(route)}
//                   className={`py-2 px-1 text-xs font-medium rounded-lg border transition capitalize ${
//                     selectedRoutes.includes(route) 
//                       ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
//                       : 'bg-[#141b2d] border-gray-700 text-gray-400 hover:border-gray-500'
//                   }`}
//                 >
//                   {route}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Timeframe Access Level */}
//           <div>
//             <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Timeframe Access Level</label>
//             <select 
//               value={accessLevel}
//               onChange={(e) => setAccessLevel(e.target.value)}
//               className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
//             >
//               <option value="Current Working Month">Current Working Month Only</option>
//               <option value="Previous Ledger">Previous Ledger</option>
//               <option value="All Access">All Access (Full Control)</option>
//             </select>
//           </div>

//           {/* Action Buttons */}
//           <div className="pt-2 flex gap-3">
//             <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition">
//               Cancel
//             </button>
//             <button type="submit" className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition shadow-lg shadow-indigo-900/20">
//               Grant Access
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ─── NAVBAR MAIN COMPONENT ────────────────────────────────────────────────────

// // 1. Role Configuration Maps
// const ROLE_CONFIGS = {
//     factory: {
//         links: [
//             { label: 'Dashboard', href: "/factory/dashboard" },
//             { label: 'Team Access', href: "/factory/team" },
//             { label: 'Production Calendar', href: "/factory/calender" },
//         ],
//         defaultButtonText: '+ New Entry',
//     },
//     marketing: {
//         links: [
//             { label: 'Sales Overview', href: "/marketing/dashboard" },
//             { label: 'Track', href: "/marketing/team" },
//             { label: 'Delivery Calendar', href: "/marketing/calender" },
//         ],
//         defaultButtonText: '+ New Delivery',
//     },
//     owner: {
//         links: [
//             { label: 'Global Monitor', href: "/owner/monitor" },
//         ],
//         defaultButtonText: 'Download Reports',
//     }
// };

// // 2. Base Page Action Button Text
// const PAGE_BUTTONS = {
//     factory: {
//         'Dashboard': { text: '+ New entry', actionId: 'new-entry' },
//         'Team Access': { text: '+ Add Team', actionId: 'add-team' },
//         'Production Calendar': { text: '+ New Event', actionId: 'new-event' },
//     },
//     marketing: {
//         'Sales Overview': { text: '+ New Delivery', actionId: 'new-delivery' },
//         'Track': { text: '+ Add Team', actionId: 'add-team' }, // Changed to add-team for consistency
//         'Delivery Calendar': { text: '+ New Event', actionId: 'new-event' },
//     },
//     owner: {
//         'Global Monitor': { text: 'Export Analytics', actionId: 'export-analytics' }
//     }
// };

// const Navbar = () => {
//     const pathname = usePathname();
//     const router = useRouter();
//     const { profile = {} } = useUser();

//     // Modal state for Team Access
//     const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

//     if (pathname === '/' || pathname === '/login') return null;

//     // 3. SEAMLESS ROUTING MAGIC
//     const urlSegment = pathname.split('/')[1];
//     const currentRole = ROLE_CONFIGS[urlSegment] ? urlSegment : 'factory'; 
//     const currentConfig = ROLE_CONFIGS[currentRole];
    
//     const activeLink = currentConfig.links.find(link => pathname.startsWith(link.href));

//     let dynamicButtonText = currentConfig.defaultButtonText;
//     let currentActionId = 'default-action';

//     if (activeLink && PAGE_BUTTONS[currentRole]?.[activeLink.label]) {
//         dynamicButtonText = PAGE_BUTTONS[currentRole][activeLink.label].text;
//         currentActionId = PAGE_BUTTONS[currentRole][activeLink.label].actionId;
//     }

//     // 4. NESTED ROUTE SMART DETECTION (Responsive to Dashboard Activities)
//     if (pathname.includes('/workplace')) {
//         dynamicButtonText = '+ Log Production';
//         currentActionId = 'log-production';
//     } else if (pathname.includes('/balance')) {
//         dynamicButtonText = '+ Add Ledger Entry';
//         currentActionId = 'add-ledger';
//     } else if (pathname.includes('/stocks')) {
//         dynamicButtonText = '+ Update Stock';
//         currentActionId = 'update-stock';
//     }

//     // 5. HIDE BUTTONS LOGIC
//     // Agar page summary ya calender ka hai, toh dono buttons hide ho jayenge
//     const isSummaryPage = pathname.includes('/summary');
//     const isCalendarPage = pathname.includes('/calender');
//     const hideActionButtons = isSummaryPage || isCalendarPage;

//     // Buttons Click Event Handler
//     const handleActionClick = (actionType) => {
//         if (actionType === 'primary') {
//             // Agar Action ID "add-team" hai, toh Modal kholo instead of routing
//             if (currentActionId === 'add-team') {
//                 setIsTeamModalOpen(true);
//             } else {
//                 router.push(`${pathname}?action=${currentActionId}`);
//             }
//         } else if (actionType === 'modify') {
//             router.push(`${pathname}?edit=true`);
//         }
//     };

//     // Dummy handler for when modal is saved (can be updated later when connecting to backend)
//     const handleSaveAccess = (data) => {
//         console.log("Saving Access Data:", data);
//         // You can dispatch to context or make API call here
//     };

//     const getInitials = (name) => {
//         if (!name) return "UI";
//         return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
//     };

//     return (
//         <div className="sticky top-0 z-50 bg-[#0b0f19] border-b border-gray-800 flex items-center justify-between px-6 h-16 text-white select-none w-full">

//             {/* Left Side: Dynamic Branding & Nav Links */}
//             <div className="flex items-center space-x-8">
//                 <Link href={`/${currentRole}/dashboard`} className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex items-center justify-center bg-white cursor-pointer hover:border-indigo-500 transition duration-150 shrink-0">
//                     <img src="/lotus.png" alt="Lotus Logo" className="object-contain p-1 w-full h-full" />
//                 </Link>

//                 <ul className="flex items-center space-x-2 text-sm font-medium">
//                     {currentConfig.links.map((link, index) => {
//                         const isActive = pathname.startsWith(link.href);
//                         return (
//                             <li key={index} className="rounded-md">
//                                 <Link
//                                     href={link.href}
//                                     className={`px-3 py-1.5 block rounded-md transition duration-150 ${isActive
//                                         ? 'bg-[#000000] text-indigo-400 font-semibold border border-indigo-900/40'
//                                         : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
//                                         }`}
//                                 >
//                                     {link.label}
//                                 </Link>
//                             </li>
//                         );
//                     })}
//                 </ul>
//             </div>

//             {/* Right Side: Smart Action Buttons & Profiling */}
//             <div className="flex items-center space-x-4">

//                 {/* Conditional Rendering: Summary aur Calender page par action buttons nahi dikhenge */}
//                 {!hideActionButtons && (
//                     <>
//                         <button 
//                             onClick={() => handleActionClick('primary')}
//                             className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-md active:scale-95 transition duration-150 whitespace-nowrap"
//                         >
//                             {dynamicButtonText}
//                         </button>

//                         <button 
//                             onClick={() => handleActionClick('modify')}
//                             className="bg-slate-800/80 hover:bg-slate-700 text-gray-200 border border-gray-700 px-4 py-1.5 rounded-md text-sm font-medium active:scale-95 transition duration-150 whitespace-nowrap"
//                         >
//                             Edit/Modify
//                         </button>
//                     </>
//                 )}

//                 <div className="text-gray-400 hover:text-gray-200 cursor-pointer p-1.5 rounded-full hover:bg-gray-800/40 transition">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                     </svg>
//                 </div>

//                 <Link 
//                     href="/account" 
//                     className="relative group flex items-center space-x-2 border border-gray-700 bg-indigo-950/40 pl-3 pr-2 py-1 rounded-full cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-900/40 transition shrink-0"
//                     title="View Account"
//                 >
//                     <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300 select-none truncate max-w-[70px]">
//                         {profile.roles ? profile.roles.split(' ')[0] : currentRole}
//                     </span>
//                     <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner shrink-0">
//                         {getInitials(profile.username)}
//                     </div>
//                 </Link>

//             </div>

//             {/* Render the Modal */}
//             <AddAccessModal 
//                 isOpen={isTeamModalOpen} 
//                 onClose={() => setIsTeamModalOpen(false)} 
//                 onSave={handleSaveAccess}
//                 currentRole={currentRole}
//             />

//         </div>
//     )
// }

// export default Navbar;