
'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function FurnitureSummary() {
  const searchParams = useSearchParams();
  const searchModel = searchParams.get('searchModel');
  
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Central production logging API endpoint
  const BACKEND_API = "http://127.0.0.1:8000/api/factory/workplace/furniture";

  useEffect(() => {
    const fetchLiveCalculatedSummary = async () => {
      try {
        setLoading(true);
        // Cache bypass query parameter logic ke sath fresh logs fetch karna
        const res = await fetch(`${BACKEND_API}?t=${new Date().getTime()}`);
        if (!res.ok) throw new Error("Central server sync failed");
        const logs = await res.json();

        // Master Catalog Matrix
        const catalogModels = [
          { name: "Chair - LM 102" }, { name: "Chair - LM 103" },
          { name: "Chair - LM 201" }, { name: "Chair - LM 202" }, { name: "Chair - LM 203" },
          { name: "Chair - LM 301" }, { name: "Chair - LM 302" }, { name: "Chair - LM 303" }, { name: "Chair - LM 304" },
          { name: "Chair - LM 401" }, { name: "Chair - LM 402" }, { name: "Chair - LM 403" },
          { name: "Chair - LM 501" }, { name: "Chair - LM 502" }, { name: "Chair - LM 503" },
          { name: "Chair - Stella" }, { name: "Chair - Comfort" }, { name: "Chair - Arm Less" },
          { name: "Stool - 901 (Big)" }, { name: "Stool - 902 (Small)" }, { name: "Stool - Ratan 601" }, { name: "Stool - Ratan 602" },
          { name: "Pirka - Big" }, { name: "Pirka - Small" },
          { name: "Table - 101 (Dlx.)" }, { name: "Table - 102 (Dlx.)" }, { name: "Table - 201 (Dlx. Glass)" }, { name: "Table - Ratan (Centre)" }
        ];

        // Process live logs and map database realities
        const processed = catalogModels.map(model => {
          const cleanModelName = model.name.toLowerCase().replace(/[^a-z0-9]/g, '');

          // Filter matching logs from active database state
          const matchedLogs = logs.filter(l => {
            if (!l.particulars) return false;
            return l.particulars.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanModelName);
          });

          // 1. Calculate Real Production Quantity from DB logs
          const totalProduced = matchedLogs.reduce((sum, currentLog) => {
            const parsedQty = typeof currentLog.quantity === 'string' 
              ? parseInt(currentLog.quantity.replace(/[^0-9]/g, '')) 
              : parseInt(currentLog.quantity);
            return sum + (parsedQty || 0);
          }, 0);

          // 2. Fetch manual operations data from localStorage cache registry
          let soldQuantity = 0;
          let rejectionQuantity = 0;

          const localSavedStocks = localStorage.getItem('furniture_stocks_state');
          if (localSavedStocks) {
            const stocksArray = JSON.parse(localSavedStocks);
            const savedItem = stocksArray.find(item => item.name === model.name);
            if (savedItem) {
              soldQuantity = savedItem.sold || 0;
              rejectionQuantity = savedItem.rejection || 0; 
            }
          }

          return {
            name: model.name,
            prod: totalProduced,
            sold: soldQuantity,
            rejection: rejectionQuantity
          };
        });

        // 🎯 CRITICAL BUG FIX FILTER: 
        // Agar item database se delete ho chuka hai (Produced === 0), toh summary me bilkul nahi aayega!
        // Sirf wahi item pass hoga jo factory me actual me produce hua hai (row.prod > 0)
        const actualProducedOnlyData = processed.filter(row => row.prod > 0);

        // Sorting by velocity
        const sortedData = actualProducedOnlyData.sort((a, b) => b.prod - a.prod);

        // Sidebar/Header top quick global search routing integration
        const finalFilteredData = searchModel 
          ? sortedData.filter(m => m.name.toLowerCase().includes(searchModel.toLowerCase())) 
          : sortedData;

        setSummaryData(finalFilteredData);
      } catch (err) {
        console.error("Summary Real-Time Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveCalculatedSummary();
  }, [searchModel]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="max-h-[72vh] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-30 shadow-md bg-[#3e1e04] ">
              <tr className="border-b border-gray-800 text-white text-xl uppercase tracking-wider font-bold">
                <th className="p-4 w-12 text-center text-white-400">S.No</th>
                <th className="p-4 w-1/3">Furniture Item Particulars</th>
                <th className="p-4 text-center text-emerald-400">Produced</th>
                <th className="p-4 text-center text-blue-400">Sold</th>
                <th className="p-4 text-center text-rose-400">Rejection</th>
                <th className="p-4 text-right pr-8 text-indigo-400">Total Available Stock</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500 font-mono text-xs animate-pulse">
                    🔄 Crunching live machine metrics and stock logs calculations...
                  </td>
                </tr>
              ) : summaryData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500 font-mono text-xs text-gray-400">
                    ❌ No live produced items found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                summaryData.map((row, idx) => {
                  // Final computation: Total = Produced - Sold - Rejection
                  const finalBalance = row.prod - row.sold - row.rejection;
                  const isTarget = searchModel && row.name.toLowerCase().includes(searchModel.toLowerCase());

                  return (
                    <tr 
                      key={idx} 
                      className={`border-b border-gray-800/40 hover:bg-gray-900/40 transition text-l ${
                        isTarget ? 'bg-amber-500/10 border-y border-amber-500/50 shadow-sm' : 'bg-indigo-950/5'
                      }`}
                    >
                      {/* S.No */}
                      <td className="p-4 text-center text-gray-500 font-mono font-medium">{idx + 1}</td>
                      
                      {/* Item Particulars */}
                      <td className="p-4 font-bold text-gray-200">
                        {row.name}
                        <span className="text-[10px] text-emerald-400 ml-1.5 font-bold bg-emerald-950/40 border border-emerald-900/40 px-1.5 py-0.5 rounded">
                          Live Active
                        </span>
                      </td>
                      
                      {/* Produced */}
                      <td className="p-4 text-center text-emerald-500 font-mono font-bold text-sm">
                        {row.prod.toLocaleString()}
                      </td>
                      
                      {/* Sold */}
                      <td className="p-4 text-center text-blue-400 font-mono font-semibold">
                        {row.sold.toLocaleString()}
                      </td>
                      
                      {/* Rejection */}
                      <td className="p-4 text-center text-rose-400 font-mono">
                        {row.rejection.toLocaleString()}
                      </td>
                      
                      {/* Net Total Available Stock Balance */}
                      <td className="p-4 text-right pr-8 font-black font-mono text-sm">
                        <span className={finalBalance < 0 ? 'text-rose-500' : 'text-indigo-400'}>
                          {finalBalance.toLocaleString()} Pcs
                        </span>
                      </td>
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