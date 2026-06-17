'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function StocksFurniture() {
  const searchParams = useSearchParams();
  const searchModel = searchParams.get('searchModel');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [saveTimestamp, setSaveTimestamp] = useState(null);
  const [isLockedByTime, setIsLockedByTime] = useState(false);

  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        setLoading(true);

        // ⏱️ 24-Hours Strict Time Lock Verification
        // const savedTime = localStorage.getItem('furniture_stocks_timestamp');
        // if (savedTime) {
        //   setSaveTimestamp(parseInt(savedTime));
        //   const hoursElapsed = (new Date().getTime() - parseInt(savedTime)) / (1000 * 60 * 60);
        //   if (hoursElapsed >= 24) {
        //     setIsLockedByTime(true);
        //   }
        // }

        const res = await fetch("http://127.0.0.1:8000/api/factory/workplace/furniture");
        const logs = res.ok ? await res.json() : [];

        // Full individual LM Series Model Catalog Matrix
        const initialModels = [
          { name: "Chair - LM 102", opening: 0 }, { name: "Chair - LM 103", opening: 0 },
          { name: "Chair - LM 201", opening: 0 }, { name: "Chair - LM 202", opening: 0 }, { name: "Chair - LM 203", opening: 0 },
          { name: "Chair - LM 301", opening: 0 }, { name: "Chair - LM 302", opening: 0 }, { name: "Chair - LM 303", opening: 0 }, { name: "Chair - LM 304", opening: 0 },
          { name: "Chair - LM 401", opening: 0 }, { name: "Chair - LM 402", opening: 0 }, { name: "Chair - LM 403", opening: 0 },
          { name: "Chair - LM 501", opening: 0 }, { name: "Chair - LM 502", opening: 0 }, { name: "Chair - LM 503", opening: 0 },
          { name: "Chair - Stella", opening: 0 }, { name: "Chair - Comfort", opening: 0 }, { name: "Chair - Arm Less", opening: 0 },
          { name: "Stool - 901 (Big)", opening: 0 }, { name: "Stool - 902 (Small)", opening: 0 }, { name: "Stool - Ratan 601", opening: 0 }, { name: "Stool - Ratan 602", opening: 0 },
          { name: "Pirka - Big", opening: 0 }, { name: "Pirka - Small", opening: 0 },
          { name: "Table - 101 (Dlx.)", opening: 0 }, { name: "Table - 102 (Dlx.)", opening: 0 }, { name: "Table - 201 (Dlx. Glass)", opening: 0 }, { name: "Table - Ratan (Centre)", opening: 0 }
        ].map(item => ({ ...item, packed: 0, sold: 0, produce: 0, rejection: 0 }));


        const mapped = initialModels.map(item => {
          const cleanItem = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          const matchLog = logs.filter(l => {
            if (!l.particulars) return false;
            return l.particulars.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanItem);
          });

          const totalProduced = matchLog.reduce((acc, curr) => {
            const qtyNum = typeof curr.quantity === 'string' ? parseInt(curr.quantity.replace(/[^0-9]/g, '')) : parseInt(curr.quantity);
            return acc + (qtyNum || 0);
          }, 0);

          return { ...item, produce: totalProduced };
        });

        // 🔄 LocalStorage Recovery System (Fix Page Reload Reset Bug)
        const localSavedData = localStorage.getItem('furniture_stocks_state');
        let finalMergedData = mapped;

        if (localSavedData) {
          const parsedLocal = JSON.parse(localSavedData);
          finalMergedData = mapped.map(serverItem => {
            // 🎯 STRICT SYSTEM OVERRIDE RULE:
            // Agar workplace se entry delete hone ki wajah se item ka produced status zero (0) hai,
            // toh local storage ke baki user inputs (packed, sold, rejection) ko strictly wipe/0 kardo!
            if (serverItem.produce === 0) {
              return {
                ...serverItem,
                packed: 0,
                sold: 0,
                rejection: 0
              };
            }

            const matchedLocal = parsedLocal.find(l => l.name === serverItem.name);
            if (matchedLocal) {
              return {
                ...serverItem,
                packed: matchedLocal.packed || 0,
                sold: matchedLocal.sold || 0,
                rejection: matchedLocal.rejection || 0
              };
            }
            return serverItem;
          });
        }

        const sortedData = finalMergedData.sort((a, b) => {
          const aFilled = a.packed > 0 || a.sold > 0 || a.produce > 0 || a.rejection;
          const bFilled = b.packed > 0 || b.sold > 0 || b.produce > 0 || b.rejection;
          if (aFilled && !bFilled) return -1;
          if (!aFilled && bFilled) return 1;
          return (b.produce - b.sold - b.rejection) - (a.produce - a.sold - a.rejection);
        });

        const finalData = searchModel ? sortedData.filter(m => m.name.toLowerCase().includes(searchModel.toLowerCase())) : sortedData;
        setData(finalData);
      } catch (err) {
        console.error("Furniture Stocks Calculation Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductionData();
  }, [searchModel]);

  const handleInputChange = (idx, field, val) => {
    if (isLockedByTime) {
      alert("Bhai, 24 ghante ka strict editing lock active ho chuka hai! Yeh data ab modify nahi kiya ja sakta.");
      return;
    }

    const updated = [...data];
    const parsedVal = val === '' ? 0 : parseInt(val) || 0;

    // Extra layer safe check: Agar item produced hi nahi hua toh field change trigger karne ki zarurat nahi hai
    if (updated[idx].produce === 0) {
      alert("Bhai, jab tak is item ki production value workplace me generate nahi hoti, tab tak manual entry process block rahegi!");
      return;
    }

    if (field === 'sold') {
      if (parsedVal > updated[idx].produce) {
        alert(`Bhai, produced stock total sirf ${updated[idx].produce} pcs hai. Sold quantity exceed nahi kar sakti!`);
        updated[idx].sold = updated[idx].produce;
      } else {
        updated[idx].sold = parsedVal;
      }
    } else if (field === 'packed') {
      if (parsedVal > updated[idx].produce) {
        alert(`Bhai, total output manufactured ${updated[idx].produce} pcs hai. Packing limit cross nahi ho sakti!`);
        updated[idx].packed = updated[idx].produce;
      } else {
        updated[idx].packed = parsedVal;
      }
    } else if (field === 'rejection') {
      if (parsedVal > updated[idx].produce) {
        alert(`Bhai, manufactured output ${updated[idx].produce} pcs hai. Rejection limit exceed nahi ho sakti!`);
        updated[idx].rejection = updated[idx].produce;
      } else {
        updated[idx].rejection = parsedVal;
      }
    } else {
      updated[idx][field] = parsedVal;
    }

    setData(updated);
    setIsModified(true); // Shows top dynamic save panel banner
  };

  const handlePermanentSave = () => {
    const timestamp = new Date().getTime();
    localStorage.setItem('furniture_stocks_state', JSON.stringify(data));
    localStorage.setItem('furniture_stocks_timestamp', timestamp.toString());
    setSaveTimestamp(timestamp);
    setIsModified(false);
    alert("💾 Furniture inventory updates committed successfully!");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 🚀 DYNAMIC BANNER PANEL */}
      {isModified && !isLockedByTime && (
        <div className="w-full bg-indigo-950/80 border border-indigo-500 rounded-xl p-4 flex items-center justify-between shadow-2xl animate-pulse">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-indigo-300">⚠️ Unsaved Furniture Modifications Detected!</span>
            <span className="text-xs text-gray-400">Page reload par data save rakhne ke liye changes commit karein. (Modifiable within 24 hours)</span>
          </div>
          <button 
            onClick={handlePermanentSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-150"
          >
            💾 Save Inventory Changes
          </button>
        </div>
      )}

      {isLockedByTime && (
        <div className="w-full bg-rose-950/40 border border-rose-900/60 rounded-xl p-3 text-center text-xs text-rose-400 font-mono">
          🔒 24-Hour window expired. Furniture stock matrix locked permanently.
        </div>
      )}

      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-30 shadow-md bg-[#532805]">
              <tr className="border-b border-gray-800 text-white text-xs uppercase tracking-wider font-bold">
                <th className="p-4 w-1/3">Furniture Good Particulars</th>
                <th className="p-4 text-center">Produced</th>
                <th className="p-4 text-center">Unpacked Balance</th>
                <th className="p-4 text-center text-emerald-400">Manual Packed</th>
                <th className="p-4 text-center text-red-400">Manual Rejection</th>
                <th className="p-4 text-center text-blue-400">Manual Sold</th>
                <th className="p-4 text-right pr-8 text-indigo-400">Total Stock</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="p-12 text-center text-gray-400 animate-pulse font-mono text-xs">🔄 Loading and syncing database furniture stock matrices...</td></tr>
              ) : (
                data.map((row, idx) => {
                  // 💎 FULL-PROOF INVENTORY OPERATION ENGINE:
                  let packedSold = 0;
                  let unpackedSold = 0;

                  if (row.sold > 0) {
                    if (row.packed >= row.sold) {
                      packedSold = row.sold;
                      unpackedSold = 0;
                    } else {
                      packedSold = row.packed;
                      unpackedSold = row.sold - row.packed - row.rejection;
                    }
                  }

                  const finalUnpackedDisplay = Math.max(0, row.produce - row.packed- row.rejection - unpackedSold);
                  const finalPackedDisplay = Math.max(0, row.packed - packedSold);
                  const netTotal = Math.max(0, row.produce - row.sold - row.rejection);
                  const isRowFilled = row.packed > 0 || row.sold > 0 || row.produce > 0 || row.rejection > 0;

                  return (
                    <tr key={idx} className={`border-b border-gray-800/50 hover:bg-gray-900/30 transition text-xs ${isRowFilled ? 'bg-indigo-950/20' : ''}`}>
                      <td className="p-4 font-bold text-gray-300">
                        {row.name} {isRowFilled && <span className="text-[10px] text-emerald-400 ml-1.5 font-bold bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.5 rounded">Active Live</span>}
                      </td>
                      <td className="p-4 text-center text-emerald-500 font-mono font-bold">{row.produce.toLocaleString()}</td>
                      
                      {/* Unpacked Balance Dynamic Cell */}
                      <td className="p-4 text-center text-amber-500 font-mono">{finalUnpackedDisplay.toLocaleString()}</td>
                      
                      {/* Manual Packed Input with Clean Post-Selling Counter */}
                      <td className="p-4 text-center">
                        <input 
                          type="number" 
                          value={row.packed === 0 ? '' : row.packed} 
                          placeholder="-"
                          disabled={isLockedByTime}
                          onChange={(e) => handleInputChange(idx, 'packed', e.target.value)} 
                          className="w-28 bg-[#141b2d] border border-gray-700 focus:border-indigo-500 rounded px-2.5 py-1.5 text-emerald-400 font-mono text-xs text-center focus:outline-none transition-all"
                        />
                        {packedSold > 0 && (
                          <div className="text-[10px] text-gray-500 mt-0.5">({finalPackedDisplay} left in pack)</div>
                        )}
                      </td>


                      {/*Manual rejection */}
                      <td className="p-4 text-center">
                        <input 
                          type="number" 
                          value={row.rejection === 0 ? '' : row.rejection} 
                          placeholder="-"
                          disabled={isLockedByTime}
                          onChange={(e) => handleInputChange(idx, 'rejection', e.target.value)} 
                          className="w-28 bg-[#141b2d] border border-gray-700 focus:border-indigo-500 rounded px-2.5 py-1.5 text-red-400 font-mono text-xs text-center focus:outline-none transition-all" 
                        />
                      </td>

                      {/* Manual Sold */}
                      <td className="p-4 text-center">
                        <input 
                          type="number" 
                          value={row.sold === 0 ? '' : row.sold} 
                          placeholder="-"
                          disabled={isLockedByTime}
                          onChange={(e) => handleInputChange(idx, 'sold', e.target.value)} 
                          className="w-28 bg-[#141b2d] border border-gray-700 focus:border-indigo-500 rounded px-2.5 py-1.5 text-blue-400 font-mono text-xs text-center focus:outline-none transition-all" 
                        />
                      </td>

                      
                      {/* Net Total Inventory (Always stable & clean) */}
                      <td className="p-4 text-right pr-8 font-bold font-mono text-indigo-400 text-sm">{netTotal.toLocaleString()} Pcs</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}