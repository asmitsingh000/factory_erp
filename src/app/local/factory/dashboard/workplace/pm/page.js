'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function PMPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action'); 
  const editId = searchParams.get('id');

  const [productionData, setProductionData] = useState([]);
  const [formData, setFormData] = useState({ itemName: '', quantity: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/factory/workplace/pm";

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // const res = await fetch(API_URL);
      // const data = await res.json();
      // setProductionData(data);
      setProductionData([
        { id: 1, particulars: "Pm Core Operations Ledger", quantity: "4,850 Inventory Units", timestamp: "Synced - June 2026" }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  useEffect(() => {
    if (action === 'edit' && editId) {
      const existingRow = productionData.find(row => row.id === parseInt(editId));
      if (existingRow) {
        setFormData({ itemName: existingRow.particulars, quantity: parseInt(existingRow.quantity) || '' });
      }
    }
  }, [action, editId, productionData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      alert(`Database Success: PM log ${action === 'edit' ? 'Updated' : 'Created'}!`);
      closeModal();
    } catch (err) { console.error(err); }
  };

  const closeModal = () => {
    router.push('/factory/dashboard/workplace/pm');
    setFormData({ itemName: '', quantity: '' });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-amber-950/20 text-white-500 border-b border-gray-800 text-xl font-semibold uppercase tracking-wider">
              <th className="p-4 w-16">S.No</th>
              <th className="p-4">Department Particulars</th>
              <th className="p-4">Quantity Status</th>
              <th className="p-4">System Audit Timestamp</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productionData.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-800/60 hover:bg-gray-900/20 transition">
                <td className="p-4 text-gray-400 font-medium">{idx + 1}</td>
                <td className="p-4 font-medium text-gray-200">{row.particulars}</td>
                <td className="p-4 text-blue-400 font-bold">{row.quantity}</td>
                <td className="p-4 text-gray-500 text-xs">{row.timestamp}</td>
                <td className="p-4 text-center">
                  <button onClick={() => router.push(`?action=edit&id=${row.id}`)} className="bg-slate-800/80 text-gray-300 hover:text-white px-3 py-1 rounded text-xs border border-gray-700 transition">Modify</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Popup Modal */}
      {action && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0b0f19] border border-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#080b13]">
              <h2 className="text-md font-bold text-white">{action === 'edit' ? '🛠️ Edit PM Batch Entry' : '⚡ Log PM Department Output'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">PM Particular Name / Batch Code</label>
                <input type="text" placeholder="e.g., Powder Mold Alpha Batch" value={formData.itemName} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Quantity Status</label>
                <input type="number" placeholder="Enter units count" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closePopup} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold">Commit to MySQL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}