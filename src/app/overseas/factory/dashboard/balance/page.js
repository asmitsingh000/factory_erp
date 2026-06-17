'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function BalanceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action');
  const editId = searchParams.get('id');

  // URL parameters extraction 
  const currentMonth = searchParams.get('month') || 'June';
  const currentYear = searchParams.get('year') || '2026';
  const workType = searchParams.get('type') || 'working';
  const isReadOnly = workType === 'records';

  const [ledgerData, setLedgerData] = useState([]);
  const [formData, setFormData] = useState({ date: '', particulars: '', type: 'Credit', amount: '' });
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api/factory/balance";

  // Fetch Balance Sheet Ledger (GET)
  const fetchLedger = async () => {
    try {
      setLoading(true);
      // const res = await fetch(API_URL);
      // const data = await res.json();
      // setLedgerData(data);

      setLedgerData([
        { id: 1, date: "2026-06-09", particulars: "Opening Balance Transfer", type: "Credit", amount: 50000, balance: 150000 }
      ]);
    } catch (err) {
      console.error("Error fetching Ledger", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  // Sync state edit properties
  useEffect(() => {
    if (action === 'edit' && editId) {
      const existingEntry = ledgerData.find(item => item.id === parseInt(editId));
      if (existingEntry) {
        setFormData({
          date: existingEntry.date,
          particulars: existingEntry.particulars,
          type: existingEntry.type,
          amount: existingEntry.amount
        });
      }
    }
  }, [action, editId, ledgerData]);

  // Handle Form Submit (POST/PUT)
  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.particulars || !formData.amount) return alert("Fill all fields");

    try {
      // const isEdit = action === 'edit';
      // await fetch(isEdit ? `${API_URL}/${editId}` : API_URL, {
      //   method: isEdit ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // fetchLedger();

      alert(`Success: Ledger statement ${action === 'edit' ? 'modified' : 'posted'} directly to MySQL db`);
      closeModal();
    } catch (err) {
      console.error("Ledger posting failed", err);
    }
  };

  const closeModal = () => {
    router.push('/factory/dashboard/balance');
    setFormData({ date: '', particulars: '', type: 'Credit', amount: '' });
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-fade-in w-full text-white">
      {/* HEADER SECTION - Context aware status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0b0f19] p-4 rounded-xl border border-gray-800 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Balance Ledger Sheet</h1>
          <p className="text-xs text-gray-400 mt-1">
            Accounting Context Period: <span className="text-indigo-400 font-semibold">{currentMonth} {currentYear}</span>
            {isReadOnly ? ' (Archive Archive Mode)' : ' (Live Edit Panel)'}
          </p>
        </div>
        <div>
          {/* {ledgerData.map((money)=>(key={money.balance}<h2>Total:{money.balance.toLocaleString()}</h2>))} */}
          {ledgerData.map((item) => (<h2 key={item.balance} className='text-center '>Budget of Month: Rs.{item.balance.toLocaleString()}</h2>))}
          {!isReadOnly && (
            <button
              onClick={() => router.push('?action=new')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 rounded-lg font-bold transition shadow-lg whitespace-nowrap"
            >
              + Add Ledger Entry
            </button>
          )}
        </div>
      </div>

      {/* BALANCE TABLE - Responsive view */}
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-[#141b2d] text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Particulars</th>
                <th className="p-4 font-semibold">Credit/Debit</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Balance Status</th>
                {!isReadOnly && <th className="p-4 font-semibold text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-gray-200 divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="p-6 text-center text-gray-500">Extracting database records...</td></tr>
              ) : (
                ledgerData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-800/20 transition">
                    <td className="p-4 text-xs font-mono text-gray-400">{item.date}</td>
                    <td className="p-4 font-medium text-gray-200">{item.particulars}</td>
                    <td className={`p-4 font-bold ${item.type === 'Credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.type === 'Credit' ? '+' : '-'}${item.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-300 font-mono">${item.amount.toLocaleString()}</td>
                    <td className="p-4 font-bold text-indigo-400 font-mono">${item.balance.toLocaleString()}</td>
                    {!isReadOnly && (
                      <td className="p-4 text-center">
                        <button
                          onClick={() => router.push(`?action=edit&id=${item.id}`)}
                          className="text-xs bg-slate-800 text-gray-300 border border-gray-700 px-3 py-1 rounded hover:text-white hover:border-gray-500"
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ledger Input Action Modal */}
      {action && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0b0f19] border border-gray-800 w-full max-w-md rounded-xl shadow-2xl p-5">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800">
              <h2 className="text-md font-bold text-white">
                {action === 'edit' ? '💰 Edit Financial Statement' : '💰 Create New Ledger Event'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Transaction Date</label>
                <input
                  type="date" value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Particulars Description</label>
                <input
                  type="text" placeholder="e.g., Materials, Wages paid to staff"
                  value={formData.particulars}
                  onChange={(e) => setFormData({ ...formData, particulars: e.target.value })}
                  className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Transaction Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Credit">Credit (+)</option>
                    <option value="Debit">Debit (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Sum Value ($)</label>
                  <input
                    type="number" placeholder="Value"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 text-sm hover:bg-gray-800 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">Post to Database</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BalancePage() {
  return (
    <Suspense fallback={<div className="text-gray-400 p-6 bg-[#080b11] min-h-screen">Loading Ledger Table Ledger context...</div>}>
      <BalanceContent />
    </Suspense>
  );
}