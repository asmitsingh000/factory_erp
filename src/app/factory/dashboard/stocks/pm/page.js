'use client'
import React, { useState, useEffect } from 'react'

export default function StocksPM() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const pmMasterSchema = [
      { name: "Woven Sacks Stock", size: "32x48 / 26x38", opening: 4500, purchase: 0, consume: 1800, repacking: 0 },
      { name: "HH Woven Stock", size: "Universal Bundle", opening: 3000, purchase: 0, consume: 1200, repacking: 0 },
      { name: "HH Handle Stock", size: "Standard Fit", opening: 8000, purchase: 0, consume: 4500, repacking: 0 },
      { name: "Cartoon Stock", size: "Heavy Duty Corrugated", opening: 1200, purchase: 0, consume: 950, repacking: 0 },
      { name: "Sticker Stock", size: "Gloss Laminated", opening: 25000, purchase: 0, consume: 11400, repacking: 0 },
      { name: "Tape Stock", size: "2 Inch x 65M", opening: 400, purchase: 0, consume: 650, repacking: 0 },
      { name: "Spray Stock", size: "Silicone Release 450ml", opening: 150, purchase: 0, consume: 220, repacking: 0 },
      { name: "Mold Spray Stock", size: "Industrial Grade", opening: 80, purchase: 0, consume: 110, repacking: 0 },
      { name: "Grip(Rubber)1201- Stock", size: "Model 1201 Custom", opening: 5000, purchase: 0, consume: 3400, repacking: 0 },
      { name: "HH Sticker Stock", size: "Mini Clear Print", opening: 18000, purchase: 0, consume: 8900, repacking: 0 },
      { name: "FURNITURE L.D. Stock", size: "Low Density Sheet Roll", opening: 1600, purchase: 0, consume: 1450, repacking: 0 },
      { name: "HOUSEHOLD L.D. Stock", size: "High Gloss LD Bag", opening: 2200, purchase: 0, consume: 1900, repacking: 0 },
      { name: "PP & PET PERFORM STOCK", size: "Pre-molded Tubes", opening: 9000, purchase: 0, consume: 7100, repacking: 0 },
      { name: "Bottle PP Stock", size: "1 Ltr Standard", opening: 4000, purchase: 0, consume: 3800, repacking: 0 },
      { name: "PP FLIP TOP & PET CAP STOCK", size: "Threaded Seals", opening: 11000, purchase: 0, consume: 10200, repacking: 0 },
      { name: "Optical Case Foam -STOCK", size: "Cushioning Blocks", opening: 3500, purchase: 0, consume: 2100, repacking: 0 }
    ];

    // Initial sort on load
    const sorted = pmMasterSchema.sort((a, b) => {
      const aFilled = a.purchase > 0 || a.repacking > 0;
      const bFilled = b.purchase > 0 || b.repacking > 0;
      if (aFilled && !bFilled) return -1;
      if (!aFilled && bFilled) return 1;
      return ((b.opening + b.purchase + b.repacking) - b.consume) - ((a.opening + a.purchase + a.repacking) - a.consume);
    });
    setData(sorted);
  }, []);

  const handleManualAdjustment = (idx, field, val) => {
    const updated = [...data];
    updated[idx][field] = val === '' ? 0 : parseInt(val) || 0;

    const resort = updated.sort((a, b) => {
      const aFilled = a.purchase > 0 || a.repacking > 0;
      const bFilled = b.purchase > 0 || b.repacking > 0;
      if (aFilled && !bFilled) return -1;
      if (!aFilled && bFilled) return 1;
      return ((b.opening + b.purchase + b.repacking) - b.consume) - ((a.opening + a.purchase + a.repacking) - a.consume);
    });
    setData(resort);
  };

  return (
    <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 z-10 shadow-md">
            <tr className="bg-[#532805] text-white text-xs uppercase tracking-wider font-bold">
              <th className="p-4 w-1/4">PM Item Particulars</th>
              <th className="p-4">Operational Size</th>
              <th className="p-4">Opening Stock</th>
              <th className="p-4 text-emerald-400">Purchased Input</th>
              <th className="p-4 text-rose-400">Automated Consumed</th>
              <th className="p-4 text-amber-400">Variance / Repacking</th>
              <th className="p-4 text-indigo-400 text-right pr-8">Final Total Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const finalTotal = (row.opening + row.purchase + row.repacking) - row.consume;
              const isRowFilled = row.purchase > 0 || row.repacking > 0;

              return (
                <tr key={idx} className={`border-b border-gray-800/50 hover:bg-gray-900/30 transition text-xs ${isRowFilled ? 'bg-indigo-950/10' : ''}`}>
                  <td className="p-4 font-bold text-gray-300">{row.name} {isRowFilled && <span className="text-[10px] text-indigo-400 ml-1.5 font-medium bg-indigo-950/80 px-1 py-0.5 rounded">Modified</span>}</td>
                  <td className="p-4 text-gray-400 font-mono text-[11px]">{row.size}</td>
                  <td className="p-4 text-gray-400 font-mono">{row.opening.toLocaleString()}</td>
                  <td className="p-4">
                    <input 
                      type="number" value={row.purchase === 0 ? '' : row.purchase} placeholder="-"
                      onChange={(e) => handleManualAdjustment(idx, 'purchase', e.target.value)} 
                      className="w-24 bg-[#141b2d] border border-gray-700 rounded px-2.5 py-1.5 font-mono text-xs text-center text-emerald-400 focus:outline-none" 
                    />
                  </td>
                  <td className="p-4 text-rose-400 font-bold font-mono">{row.consume.toLocaleString()}</td>
                  <td className="p-4">
                    <input 
                      type="number" value={row.repacking === 0 ? '' : row.repacking} placeholder="-"
                      onChange={(e) => handleManualAdjustment(idx, 'repacking', e.target.value)} 
                      className="w-20 bg-[#141b2d] border border-gray-700 rounded px-2.5 py-1.5 font-mono text-xs text-center text-amber-400 focus:outline-none" 
                    />
                  </td>
                  <td className="p-4 font-bold font-mono text-indigo-400 text-sm text-right pr-8">{finalTotal.toLocaleString()} Units</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}