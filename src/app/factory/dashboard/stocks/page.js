// //this is the page for the stocks it is a frontend file its route is app/factory/dashboard/stocks/page.js

// 'use client'
// import React, { useState, useEffect } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'

// export default function StocksPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const action = searchParams.get('action');
//   const editId = searchParams.get('id');

//   const [stocks, setStocks] = useState([]);
//   const [formData, setFormData] = useState({ name: '', category: 'Raw Material', qty: '' });
//   const [loading, setLoading] = useState(false);

//   const API_URL = "http://127.0.0.1:8000/api/factory/stocks";

//   // Fetch Inventory Data (GET)
//   const fetchStocks = async () => {
//     try {
//       setLoading(true);
//       // const res = await fetch(API_URL);
//       // const data = await res.json();
//       // setStocks(data);
      
//       // Mock Data till Laravel connects
//       setStocks([
//         { id: 1, name: "Premium Walnut Wood", category: "Raw Material", qty: 12, status: "LOW STOCK" },
//         { id: 2, name: "Steel Hinges 4-inch", category: "Hardware", qty: 450, status: "HEALTHY" }
//       ]);
//     } catch (err) {
//       console.error("Error fetching inventory data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStocks();
//   }, []);

//   // Sync Form Data when clicking Modify/Edit
//   useEffect(() => {
//     if (action === 'edit' && editId) {
//       const existingStock = stocks.find(item => item.id === parseInt(editId));
//       if (existingStock) {
//         setFormData({ 
//           name: existingStock.name, 
//           category: existingStock.category, 
//           qty: existingStock.qty 
//         });
//       }
//     }
//   }, [action, editId, stocks]);

//   // Handle Form Submit (POST/PUT)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name || !formData.qty) return alert("All fields are required!");

//     try {
//       // const isEdit = action === 'edit';
//       // const res = await fetch(isEdit ? `${API_URL}/${editId}` : API_URL, {
//       //   method: isEdit ? 'PUT' : 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify(formData)
//       // });
//       // if(res.ok) { fetchStocks(); closeModal(); }

//       alert(`Database Success: Stock component '${formData.name}' ${action === 'edit' ? 'updated' : 'created'} successfully!`);
//       closeModal();
//     } catch (err) {
//       console.error("API Inventory Error:", err);
//     }
//   };

//   const closeModal = () => {
//     router.push('/factory/dashboard/stocks');
//     setFormData({ name: '', category: 'Raw Material', qty: '' });
//   };

//   return (
//     <div className="p-6 text-white bg-[#080b11] min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-xl font-bold">Factory Raw Inventory & Finished Stocks</h1>
//           <p className="text-xs text-gray-400 mt-1">Manage physical inventory levels</p>
//         </div>
//         <button 
//           onClick={() => router.push('?action=new')}
//           className="bg-[#155DFC] hover:bg-[#3c75f0] text-white text-xs px-4 py-2.5 rounded-lg font-bold transition shadow-md"
//         >
//           + Update Stock
//         </button>
//       </div>

//       <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden">
//         <table className="w-full text-left text-sm border-collapse">
//           <thead>
//             <tr className="bg-[#532805] text-white-500 border-b border-gray-800 text-2xl font-semibold uppercase tracking-wider">
//               <th className="p-4">Item Name</th>
//               <th className="p-4">Category</th>
//               <th className="p-4">In Stock Units</th>
//               <th className="p-4">Status Alert</th>
//               <th className="p-4 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr><td colSpan="5" className="p-6 text-center text-gray-500">Loading master stocks...</td></tr>
//             ) : (
//               stocks.map((stock) => (
//                 <tr key={stock.id} className="border-b border-gray-800/60 hover:bg-gray-900/10 transition text-xl">
//                   <td className="p-4 font-medium text-gray-200">{stock.name}</td>
//                   <td className="p-4 text-gray-400 text-xs">{stock.category}</td>
//                   <td className="p-4 font-bold text-blue-400">{stock.qty} Units</td>
//                   <td className="p-4">
//                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stock.status === 'HEALTHY' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' : 'bg-rose-950 text-rose-400 border border-rose-900/50'}`}>
//                       {stock.status}
//                     </span>
//                   </td>
//                   <td className="p-4 text-center">
//                     <button 
//                       onClick={() => router.push(`?action=edit&id=${stock.id}`)}
//                       className="bg-gray-800 text-gray-300 hover:text-white px-3 py-1 rounded text-xs border border-gray-700 transition"
//                     >
//                       Modify
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Dynamic Action Modal Panel */}
//       {action && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//           <div className="bg-[#0b0f19] border border-gray-800 w-full max-w-md rounded-xl shadow-2xl p-5">
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
//               <h2 className="text-md font-bold text-white">
//                 {action === 'edit' ? '📦 Edit Inventory Stock Log' : '📦 Add Inventory Stock Item'}
//               </h2>
//               <button onClick={closeModal} className="text-gray-400 hover:text-white">✕</button>
//             </div>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Item Component Name</label>
//                 <input 
//                   type="text" placeholder="e.g., Premium Walnut Wood" 
//                   value={formData.name} 
//                   onChange={(e) => setFormData({...formData, name: e.target.value})} 
//                   className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" 
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Category Classification</label>
//                 <select 
//                   value={formData.category} 
//                   onChange={(e) => setFormData({...formData, category: e.target.value})} 
//                   className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
//                 >
//                   <option value="Raw Material">Raw Material</option>
//                   <option value="Hardware">Hardware</option>
//                   <option value="Finished Goods">Finished Goods</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Net Units Available</label>
//                 <input 
//                   type="number" placeholder="Count units" 
//                   value={formData.qty} 
//                   onChange={(e) => setFormData({...formData, qty: e.target.value})} 
//                   className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" 
//                 />
//               </div>
//               <div className="pt-4 flex gap-3">
//                 <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition">Cancel</button>
//                 <button type="submit" className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">Commit Update</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  redirect('/factory/dashboard/stocks/furniture');
}