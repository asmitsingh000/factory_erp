'use client'
import React, { useState, useEffect } from 'react'

export default function StocksRawMaterials() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const rawMaterialsList = [
      "PPHP", "PPCP", "HD Inj.", "PP RANDOM", "LLDPE", "FILLER", "FACTORY CUTTING(PP)", "FACTORY CUTTING(HD)", "MARKET CUTTING(PP)", "RP GRAMULES(COLOR)", "RP GRANULES(PLAIN)", 
      "MB - Prabhu Red - LRD/01", "MB - Prabhu Blue -LBL-13", "MB - Prabhu Yellow-LYL-04", "MB - Prabhu Brown-LBR-07UV", "MB - Prabhu Beige-LBR-11/MBL", "MB - Prabhu M-White", "MB - Prabhu White-11UMB10025N", 
      "MB - Rajiv Red (TRMB)", "MB - Rajiv Mango Yellow", "MB - Rajiv M.Silver-219834002", "MB - Rajiv P.Green-219770098", "MB - Rajiv Black-219660061", "MB - Rajiv Blue-219110036", "MB - Rajiv S.Yellow-219220013", "MB - Rajiv Grey-219630016", 
      "GREEN TRMGB-219770903", "GREEN PEARAL-219775031", "PURPLE-219320170", "PINK-219310294", "ORANGE-219230001", "BRD.RED(H.H.)-219330001", "TRMB BLUE (H.H.) -219110007", "DEEP BLUE (H.H.)-219110014", "GREEN WM-361C (H.H.) 219770358", 
      "MB - Rajiv T-BROWN-219650403", "M-GREY-219663062", "L-GREEN-219770333", "O.B.SPL-219080021", "PINK-219310132", "PINK-219310160", "PINK-219310005", "MB - Rajiv Red -H -1795C-219330239", 
      "MB - Rajiv Stone Grey", "MB - Rajiv Stone White", "MB - Rajiv Stone Black", "MB - Rajiv Stone Brown", "STATE GREY (S-GREY)-219630343", "MATIKA BROWN (M-BROWN)-219650005", "DARK BROWN (D-BROWN)-219650003", "Pallavi Lubricants -Golden"
    ];

    const structured = rawMaterialsList.map(name => ({
      name,
      opening: 5000,
      consumption: 1200,
      purchase: 3000,
      sales: 400
    }));
    setData(structured);
  }, []);

  const handleFieldChange = (idx, field, val) => {
    const updated = [...data];
    updated[idx][field] = parseInt(val) || 0;
    setData(updated);
  };

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-[#532805] text-white border-b border-gray-800 text-lg uppercase tracking-wider font-semibold">
            <th className="p-4">Raw Material Variant Name</th>
            <th className="p-4">Opening Stock</th>
            <th className="p-4 text-rose-400">Consumption</th>
            <th className="p-4 text-emerald-400">Purchase Input</th>
            <th className="p-4 text-blue-400">Direct Sales</th>
            <th className="p-4 text-indigo-400">Total Balance (Net)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            // Raw Material Balance Math Formula: Total = (Opening + Purchase) - (Consumption + Sales)
            const totalBalance = (row.opening + row.purchase) - (row.consumption + row.sales);

            return (
              <tr key={idx} className="border-b border-gray-800/60 hover:bg-gray-900/10 transition text-base">
                <td className="p-4 font-bold text-gray-300 text-sm">{row.name}</td>
                <td className="p-4 text-gray-400 font-mono">{row.opening.toLocaleString()} Kg</td>
                <td className="p-4">
                  <input type="number" value={row.consumption} onChange={(e) => handleFieldChange(idx, 'consumption', e.target.value)} className="w-24 bg-[#141b2d] border border-gray-700 rounded px-2 py-1 text-sm font-mono text-rose-400 focus:outline-none" />
                </td>
                <td className="p-4">
                  <input type="number" value={row.purchase} onChange={(e) => handleFieldChange(idx, 'purchase', e.target.value)} className="w-24 bg-[#141b2d] border border-gray-700 rounded px-2 py-1 text-sm font-mono text-emerald-400 focus:outline-none" />
                </td>
                <td className="p-4">
                  <input type="number" value={row.sales} onChange={(e) => handleFieldChange(idx, 'sales', e.target.value)} className="w-24 bg-[#141b2d] border border-gray-700 rounded px-2 py-1 text-sm font-mono text-blue-400 focus:outline-none" />
                </td>
                <td className="p-4 font-bold font-mono text-indigo-300 text-md">{totalBalance.toLocaleString()} Kg</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}