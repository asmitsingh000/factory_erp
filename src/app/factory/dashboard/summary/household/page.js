
'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function householdSummary() {
  const searchParams = useSearchParams();
  const searchModel = searchParams.get('searchModel');
  
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Central production logging API endpoint
  const BACKEND_API = "http://127.0.0.1:8000/api/factory/workplace/household";

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
        { name: "Bucket 5 Ltr." }, { name: "Bucket 8 Ltr." }, { name: "Bucket 10 Ltr." }, { name: "Bucket 13 Ltr." }, { name: "Bucket 15 Ltr." }, { name: "Bucket 17 Ltr." }, { name: "Bucket 20 Ltr." }, { name: "Bucket 25 Ltr." },
    { name: "Lid 5 Ltr." }, { name: "Lid 8 Ltr." }, { name: "Lid 10 Ltr." }, { name: "Lid 13 Ltr." }, { name: "Lid 15 Ltr." }, { name: "Lid 17 Ltr." }, { name: "Lid 20 Ltr." }, { name: "Lid 25 Ltr." },
    { name: "Basin 13″" }, { name: "Basin 15″" }, { name: "Basin 17.5″" }, { name: "Basin 19″" }, { name: "Basin 21″" }, { name: "Basin Deluxe 17″" }, { name: "Basin Deluxe 20″" },
    { name: "Basin Wave 7″" }, { name: "Basin Wave 9″" }, { name: "Basin Wave 11″" },
    { name: "Tab 40 Ltr. (2440)" }, { name: "Mug - 075" }, { name: "Mug - 101" }, { name: "Mug - 102" }, { name: "Mug - 151" }, { name: "Jug - 125" }, { name: "Jug - 201" }, { name: "Jug - 202 Colour" }, { name: "Jug - 202 Rand." },
    { name: "Strainer 9″" }, { name: "Strainer 11″" }, { name: "Soap Dish – 701" }, { name: "Soap Case – Rose" }, { name: "Soap Dish 3 in 1" }, { name: "Utility Stand 210" },
    { name: "Lunch Box Body" }, { name: "Fancy Basket Body" }, { name: "Masala Box – Dlx. 111" }, { name: "Masala Box – 2400" }, { name: "Hanger 901" }, { name: "Hanger 902" }, { name: "Coat Hanger – G11" },
    { name: "Wash Brush 255" }, { name: "Drum 35 Ltr." }, { name: "Drum 50 Ltr." }, { name: "Drum 40 Ltr. (Sq.)" }, { name: "Lid 35 Ltr." }, { name: "Lid 50 Ltr." }, { name: "Lid 40 Ltr. (Sq.)" },
    { name: "Dust Pan – 111" }, { name: "Dust Pan – 222" }, { name: "Colander 13″" }, { name: "Colander With Handle – 900" }, { name: "Nanglo 201" }, { name: "Car Pot – 777" },
    { name: "MPC – 801" }, { name: "MPC Step – 115" }, { name: "MPC with Lid – 1201" }, { name: "Pedal Bin Set – 107" }, { name: "Pedal Bin Set – 108" },
    { name: "Swing Ring – 35 Ltr." }, { name: "Swing Ring – 50 Ltr." }, { name: "Swing Ring – 40 Ltr." },
    { name: "MP Rect. Rack – 3 Step" }, { name: "MP Rect. Rack – 4 Step" }, { name: "MP Flower Rack – 3 Step" }, { name: "MP Flower Rack – 4 Step" },
    { name: "SF – 1400 Body" }, { name: "SF – 2400 Body" }, { name: "SF – 3800 Body" }, { name: "SF – 3000 Body" }, { name: "SF – 5000 Body" }, { name: "SF – 7000 Body" }, { name: "SF – 10000 Body" },
    { name: "SF – 1700 Body" }, { name: "Kitchen Tray – 410" }, { name: "Kitchen Tray – 420" },
    { name: "Launda Basket – 1200 Body" }, { name: "Kitchen Tray – 510" }, { name: "Kitchen Tray – 520" }, { name: "Kitchen Tray – 530" }, { name: "Kitchen Tray – 540" },
    { name: "Ghemela 20″ (2001)" }, { name: "Funnel – 401" }, { name: "Funnel – 601" }, { name: "Mini Basket Body" },
    { name: "Dish Rack – 555" }, { name: "Tray – 555" }, { name: "Multi Storage Box – I" }, { name: "Multi Storage Box – A" }, { name: "Multi Storage Box – 4" },
    { name: "Fruit Basket – 175" }, { name: "Utility Pen Stand – 100 Body" },
    { name: "FB 1000 (Bottle)" }, { name: "FB 1000 (Bottle) – D" }, { name: "FB 2000 (Bottle)" }, { name: "FB 2100 (Bottle)" }, { name: "FB 3000 (Bottle)" }, { name: "FB 3150 (Bottle)" }, { name: "FB 3100 (Bottle)" },
    { name: "Planter Nature 800" }, { name: "Planter Nature 1000" }, { name: "Planter Nature 1200" }, { name: "Planter Plate Nature 800" }, { name: "Planter Plate Nature 1000" }, { name: "Planter Plate Nature 1200" },
    { name: "Planter Nature 450" }, { name: "Planter Nature 550" }, { name: "Planter Nature 650" }, { name: "Planter Flora 800" }, { name: "Planter Flora 1000" }, { name: "Planter Plate Flora 800" }, { name: "Planter Plate Flora 1000" },
    { name: "Planter Hexa (120)" }, { name: "Planter Hexa (160)" }, { name: "Planter Hexa (200)" }, { name: "Planter Pearl – 900" }, { name: "Hanging Planter Nature H701" }, { name: "Hanging Planter – Nature H901" }
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

          const localSavedStocks = localStorage.getItem('household_stocks_state');
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
                <th className="p-4 w-1/3">household Item Particulars</th>
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