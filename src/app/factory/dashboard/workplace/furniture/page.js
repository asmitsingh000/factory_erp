'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function FurnitureWorkplace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAddLogMode = searchParams.get('add-log') === 'true';
  const searchModel = searchParams.get('searchModel');

  const [productionLogs, setProductionLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Inline dynamic dashboard fields editing states
  const [editingLogId, setEditingLogId] = useState(null);
  const [inlineQuantity, setInlineQuantity] = useState('');

  // Filtering dashboard listing states
  const [filterItem, setFilterItem] = useState('ALL');
  const [filterMachine, setFilterMachine] = useState('ALL');
  const [filterColor, setFilterColor] = useState('ALL');
  const [sortBy, setSortBy] = useState('LATEST'); 

  const machineModels = ["MM-100", "MM-150-A", "MM-150-B", 'MM-200', 'MM-250', 'MM-350', 'MM-450', 'MM-6270', 'MM-8800', 'MM-800'];
  const colorColumns = ["RED", "BLU", "PGN", "BRN", "BGE", "WHITE", "RWD", "SGY", "SWD", "ORG", "BLACK", "PINK", "PURPLE", "YLW"];
  const categoriesList = ["ALL", "CHAIR", "TABLE", "STOOL", "PIRKA", "OTHERS"];
  
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedMachine, setSelectedMachine] = useState("MM-100");
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);
  
  // ─── CHANGE 1: STRUCTURE MATRIX TO TRACK MULTIPLE MACHINES AT ONCE ───
  // Format: matrixState[machineModel][itemName][color]
  const [matrixState, setMatrixState] = useState({});

  const furnitureItems = [
    "Chair - LM 102", "Chair - LM 103", "Chair - LM 201", "Chair - LM 202", "Chair - LM 203",
    "Chair - LM 301", "Chair - LM 302", "Chair - LM 303", "Chair - LM 304", "Chair - LM 401",
    "Chair - LM 402", "Chair - LM 403", "Chair - LM 501", "Chair - LM 502", "Chair - LM 503",
    "Chair - LM 601", "Chair - LM 602", "Chair - LM 603", "Chair - LM 701", "Chair - LM 702",
    "Chair - LM 801", "Chair - LM 803", "Chair - LM 804", "Chair - LM 901", "Chair - LM 902",
    "Chair - LM 903", "Chair - LM 904", "Chair - LM 1001", "Chair - LM 1002", "Chair - LM 1003",
    "Chair - LM 1004", "Chair - LM 1101", "Chair - LM 1102", "Chair - LM 1103", "Chair - LM 1201",
    "Chair - LM 1401", "Chair - LM 1402", "Chair - LM 1501", "Chair - LM 1502", "Chair - LM 1601",
    "Chair - LM 1602", "Chair - LM 1603", "Table – TBL-R-ST", "Table – TBL-R", "Table – TBL-S-ST",
    "Table – TBL-S", "Table – TBL-Y", "Table – TBL-Y-N", "Stool – STL-R", "Stool – STL-S",
    "R. Stool – RS-R", "Pirka – PK-R", "Pirka - 1201", "Big Pirka – BPK-R", "Chair - LM 51",
    "Chair - LM 52", "Chair - LM 53", "Chair - LM 61", "Chair – LM 62", "Chair - LM 63",
    "Chair - LM 64", "Fridge Stand", "M. Stool – M-STL-S", "Rattan MS – RMS-R", "Rattan MS – RMS-S",
    "Cookie MS – CMS-R", "T. Table – T-TBL-F", "T. Table – T-TBL-S", "Veg. Crate"
  ];

  const API_URL = "http://127.0.0.1:8000/api/factory/workplace/furniture";

  // ─── CHANGE 2: INITIALIZE MATRIX WITH MACHINE UNDERLAYS ───
  const loadExistingMatrixData = (currentLogs) => {
    const initialGrid = {};
    
    // Sabhi machines ke liye base grids structure design karein
    machineModels.forEach(m => {
      initialGrid[m] = {};
      furnitureItems.forEach(item => {
        initialGrid[m][item] = {};
        colorColumns.forEach(color => { initialGrid[m][item][color] = ""; });
      });
    });

    // Database se data parse karke respective machine blocks me store karein
    currentLogs.forEach(log => {
      if (log.production_date !== productionDate) return; // Date filter alignment

      const bracketIndex = log.particulars.lastIndexOf(" (");
      if (bracketIndex !== -1) {
        const itemName = log.particulars.substring(0, bracketIndex).trim();
        const colorName = log.particulars.substring(bracketIndex + 2, log.particulars.length - 1).toUpperCase().trim();
        const machine = log.machine_model;

        if (initialGrid[machine] && initialGrid[machine][itemName] && initialGrid[machine][itemName][colorName] !== undefined) {
          initialGrid[machine][itemName][colorName] = log.quantity;
        }
      }
    });

    setMatrixState(initialGrid);
  };

  // ─── CHANGE 3: CACHE BUSTING ENGINE ON FETCH ───
  const fetchDashboardLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?t=${new Date().getTime()}`, {
        method: 'GET',
        headers: { 
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', 
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProductionLogs(data);
        return data;
      }
    } catch (err) { console.error("Data loading fail:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const syncWorkspace = async () => {
      const logs = await fetchDashboardLogs();
      if (logs) loadExistingMatrixData(logs);
    };
    syncWorkspace();
  }, [isAddLogMode, productionDate]);

  const handleDeleteLog = async (id) => {
    // if (!window.confirm("Bhai, kya aap sach me is production log ko permanent delete karna chahte ho?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductionLogs(prev => prev.filter(log => log.id !== id));
      }
    } catch (err) { console.error("Delete Error:", err); }
  };

  const handleInlineSave = async (log) => {
    const qtyParsed = parseInt(inlineQuantity);
    if (!qtyParsed || qtyParsed < 1) return;
    try {
      const res = await fetch(`${API_URL}/${log.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          particulars: log.particulars,
          machine_model: log.machine_model,
          quantity: qtyParsed,
          production_date: log.production_date
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setProductionLogs(prev => prev.map(item => item.id === log.id ? updated.data : item));
        setEditingLogId(null);
      }
    } catch (err) { console.error("Inline Update Error:", err); }
  };

  // ─── CHANGE 4: INPUT STATE INJECTION BY CURRENT ACTIVE MACHINE ───
  const handleMatrixInputChange = (itemName, color, value) => {
    setMatrixState(prev => ({
      ...prev,
      [selectedMachine]: {
        ...prev[selectedMachine],
        [itemName]: {
          ...prev[selectedMachine]?.[itemName],
          [color]: value === "" ? "" : parseInt(value) || 0
        }
      }
    }));
  };

  const getRowTotal = (itemName) => {
    if (!matrixState[selectedMachine]?.[itemName]) return 0;
    return colorColumns.reduce((sum, color) => sum + (parseInt(matrixState[selectedMachine][itemName][color]) || 0), 0);
  };

  const filteredFurnitureItems = furnitureItems.filter(item => {
    const nameLow = item.toLowerCase();
    if (activeCategory === "ALL") return true;
    if (activeCategory === "CHAIR") return nameLow.includes("chair");
    if (activeCategory === "TABLE") return nameLow.includes("table");
    if (activeCategory === "STOOL") return nameLow.includes("stool");
    if (activeCategory === "PIRKA") return nameLow.includes("pirka");
    return !nameLow.includes("chair") && !nameLow.includes("table") && !nameLow.includes("stool") && !nameLow.includes("pirka");
  });

  // ─── CHANGE 5: REVOLUTIONARY BATCH MULTI-MACHINE PROCESSING SUBMIT ENGINE ───
  const handleBulkMatrixSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let operationsSuccess = true;
      
      // Pure machine network map ko iterate karein dropdown ki chinta kiye bina!
      for (const machine of machineModels) {
        for (const item of furnitureItems) {
          for (const color of colorColumns) {
            
            const quantity = parseInt(matrixState[machine]?.[item]?.[color]);
            const keyString = `${item} (${color})`;

            // DB row matching search checks
            const existingLog = productionLogs.find(log => 
              log.particulars === keyString && 
              log.machine_model === machine && 
              log.production_date === productionDate
            );

            if (quantity && quantity > 0) {
              if (existingLog) {
                // Modifying row if quantity misaligned
                if (existingLog.quantity !== quantity) {
                  const res = await fetch(`${API_URL}/${existingLog.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                      particulars: keyString,
                      quantity: quantity,
                      machine_model: machine,
                      production_date: productionDate
                    })
                  });
                  if (!res.ok) operationsSuccess = false;
                }
              } else {
                // New fresh entry setup injection
                const res = await fetch(API_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                  body: JSON.stringify({
                    particulars: keyString,
                    quantity: quantity,
                    machine_model: machine,
                    production_date: productionDate
                  })
                });
                if (!res.ok) operationsSuccess = false;
              }
            } else if ((quantity === 0 || matrixState[machine]?.[item]?.[color] === "") && existingLog) {
              // Delete cleared nodes
              const res = await fetch(`${API_URL}/${existingLog.id}`, { method: 'DELETE' });
              if (!res.ok) operationsSuccess = false;
            }

          }
        }
      }

      if (operationsSuccess) {
        router.refresh();
        setTimeout(async () => {
          await fetchDashboardLogs(); 
          router.push("/factory/dashboard/workplace/furniture");
        }, 150);
      } else {
        alert("Server validation errors encountered on some batch blocks.");
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const processedLogs = productionLogs
    .filter(log => {
      if (!log.particulars) return false;
      const matchesSearch = searchModel ? log.particulars.toLowerCase().includes(searchModel.toLowerCase()) : true;
      
      let matchesItemType = true;
      if (filterItem !== 'ALL') {
        const partLow = log.particulars.toLowerCase();
        if (filterItem === 'OTHERS') {
          matchesItemType = !partLow.includes('chair') && !partLow.includes('table') && !partLow.includes('stool') && !partLow.includes('pirka');
        } else {
          matchesItemType = partLow.includes(filterItem.toLowerCase());
        }
      }

      const matchesMachine = filterMachine === 'ALL' ? true : log.machine_model === filterMachine;
      let matchesColor = true;
      if (filterColor !== 'ALL') {
        matchesColor = log.particulars.toUpperCase().includes(`(${filterColor.toUpperCase()})`);
      }

      return matchesSearch && matchesItemType && matchesMachine && matchesColor;
    })
    .sort((a, b) => {
      if (sortBy === 'LATEST') return b.id - a.id; 
      if (sortBy === 'QTY_DESC') return (parseInt(b.quantity) || 0) - (parseInt(a.quantity) || 0);
      if (sortBy === 'QTY_ASC') return (parseInt(a.quantity) || 0) - (parseInt(b.quantity) || 0);
      if (sortBy === 'DATE_ASC') return new Date(a.production_date).getTime() - new Date(b.production_date).getTime();
      return 0;
    });

  if (isAddLogMode) {
    return (
      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-6 min-h-[80vh]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-5 mb-5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Bulk Production Matrix Ledger</h2>
            <p className="text-xs text-gray-400 mt-1">Switching machines preserves memory. Everything updates on click save.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">Production Run Date</label>
              <input type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} className="bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-mono" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">Active Machine Model View</label>
              <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} className="bg-[#141b2d] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none font-bold text-amber-500">
                {machineModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center bg-[#111625] w-fit p-1 rounded-lg border border-gray-800/80 mb-5 gap-1">
          {categoriesList.map((cat) => (
            <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all uppercase ${activeCategory === cat ? 'bg-[#532805] text-white shadow-md border border-[#7c3f0b]' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleBulkMatrixSubmit}>
          <div className="overflow-x-auto max-h-[58vh] border border-gray-800/80 rounded-lg relative">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-30 bg-[#532805] text-white font-bold shadow-md">
                <tr>
                  <th className="p-3 border-b border-gray-800 bg-[#532805] sticky left-0 z-40 min-w-[210px]">Furniture Model Variant</th>
                  {colorColumns.map(color => <th key={color} className="p-2 text-center border-b border-l border-gray-800/60 min-w-[65px] font-mono text-[11px]">{color}</th>)}
                  <th className="p-3 text-right border-b border-l border-gray-800 bg-[#3a1d04] sticky right-0 z-40 min-w-[80px]">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredFurnitureItems.map((item, itemIdx) => {
                  const totalCount = getRowTotal(item);
                  const cellValue = matrixState[selectedMachine]?.[item]?.[colorColumns[0]] !== undefined;
                  return (
                    <tr key={itemIdx} className="border-b border-gray-800/40 hover:bg-gray-900/40 transition-colors odd:bg-gray-950/20">
                      <td className="p-3 font-semibold text-gray-200 sticky left-0 bg-[#0e1422] border-r border-gray-800 shadow-sm">{item}</td>
                      {colorColumns.map(color => (
                        <td key={color} className="p-1 border-l border-gray-800/30">
                          <input 
                            type="number" 
                            min="0" 
                            placeholder="-" 
                            value={matrixState[selectedMachine]?.[item]?.[color] ?? ""} 
                            onChange={(e) => handleMatrixInputChange(item, color, e.target.value)} 
                            className={`w-full bg-transparent p-1 text-center font-mono focus:bg-indigo-950/40 focus:outline-none font-medium transition-all ${matrixState[selectedMachine]?.[item]?.[color] > 0 ? 'text-emerald-400 font-bold bg-emerald-950/10' : 'text-gray-500'}`} 
                          />
                        </td>
                      ))}
                      <td className={`p-3 text-right font-black font-mono shadow-sm border-l border-gray-800 sticky right-0 text-sm ${totalCount > 0 ? 'bg-indigo-950 text-indigo-400' : 'bg-[#0e1422] text-gray-600'}`}>{totalCount.toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 mt-6 border-t border-gray-800 pt-4">
            <button type="button" onClick={() => router.push("/factory/dashboard/workplace/furniture")} className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-gray-800 transition">Cancel & Exit</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition">{saving ? "🔄 Committing Multi-Machine Matrix..." : "💾 Save All Machine Records"}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#111625] p-4 rounded-xl border border-gray-800">
        <div>
          <h1 className="text-lg font-black text-white uppercase tracking-wider">Furniture Line Logging</h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time status view of currently committed factory entries</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wide">Item Type</span>
            <select value={filterItem} onChange={(e) => setFilterItem(e.target.value)} className="bg-[#0b0f19] border border-gray-800 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-300 focus:outline-none focus:border-indigo-600 font-semibold">
              <option value="ALL">All Items</option>
              <option value="CHAIR">Chairs</option>
              <option value="TABLE">Tables</option>
              <option value="STOOL">Stools</option>
              <option value="PIRKA">Pirkas</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wide">Machine</span>
            <select value={filterMachine} onChange={(e) => setFilterMachine(e.target.value)} className="bg-[#0b0f19] border border-gray-800 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-300 focus:outline-none focus:border-indigo-600 font-medium">
              <option value="ALL">All Machines</option>
              {machineModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wide">Color Variant</span>
            <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)} className="bg-[#0b0f19] border border-gray-800 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-300 focus:outline-none focus:border-indigo-600 font-medium">
              <option value="ALL">All Colors</option>
              {colorColumns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wide">Sort Columns</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0b0f19] border border-gray-800 rounded-lg px-2.5 py-1.5 text-[11px] text-amber-500 border-amber-900/40 focus:outline-none font-bold">
              <option value="LATEST">Latest Entry</option>
              <option value="QTY_DESC">Quantity: High ➔ Low</option>
              <option value="QTY_ASC">Quantity: Low ➔ High</option>
              <option value="DATE_ASC">Oldest Production Run</option>
            </select>
          </div>

          <button onClick={() => router.push("?add-log=true")} className="bg-indigo-600 hover:bg-indigo-500 font-bold text-[11px] text-white px-3.5 py-2 rounded-lg shadow uppercase tracking-wider mt-3">
            ➕ Log New Sheet
          </button>
        </div>
      </div>

      <div className="bg-[#0b0f19] border border-gray-800 rounded-xl overflow-hidden">
        <div className="max-h-[65vh] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className='sticky top-0 z-30 bg-[#532805] shadow-md'>
              <tr className=" border-b border-gray-800 text-xl text-white-500 uppercase tracking-wider font-semibold">
                <th className="p-4">Production Model Name</th>
                <th className="p-4 text-center">Output Metric (Quantity)</th>
                <th className="p-4 text-center">Machine Model</th>
                <th className="p-4 text-center">Run Log Timestamp</th>
                <th className="p-4 text-right pr-6">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-12 text-center text-gray-400 animate-pulse font-mono">🔄 Loading real-time workspace activity...</td></tr>
              ) : processedLogs.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-red-500 font-mono text-xl"> No matched data logs found.</td></tr>
              ) : (
                processedLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800/40 hover:bg-gray-900/20 transition-colors">
                    <td className="p-4 font-bold text-gray-200">{log.particulars}</td>
                    <td className="p-4 text-center">
                      {editingLogId === log.id ? (
                        <div className="flex items-center justify-center gap-1.5 mx-auto max-w-[120px]">
                          <input type="number" value={inlineQuantity} onChange={(e) => setInlineQuantity(e.target.value)} className="bg-[#141b2d] border border-indigo-500 rounded px-2 py-1 text-center w-20 text-white font-mono font-bold focus:outline-none" autoFocus />
                          <button onClick={() => handleInlineSave(log)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-1.5 py-1 rounded font-bold">✓</button>
                          <button onClick={() => setEditingLogId(null)} className="bg-gray-700 hover:bg-gray-600 text-white text-[10px] px-1.5 py-1 rounded">✕</button>
                        </div>
                      ) : (
                        <span onClick={() => { setEditingLogId(log.id); setInlineQuantity(log.quantity); }} className="cursor-pointer px-3 py-1 rounded hover:bg-gray-800/80 text-emerald-400 font-mono font-bold text-sm border border-transparent hover:border-gray-700/50 transition-all">
                          {(parseInt(log.quantity) || 0).toLocaleString()} 📝
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center"><span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700/60 text-gray-300 font-mono text-xl">{log.machine_model || "N/A"}</span></td>
                    <td className="p-4 text-center text-gray-400 font-mono text-xl">{log.production_date || "Unknown"}</td>
                    <td className="p-4 text-right pr-6"><button onClick={() => handleDeleteLog(log.id)} className="bg-rose-950/30 border border-rose-900/50 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg px-2.5 py-1.5 text-xs font-bold font-mono transition tracking-tight">🗑️ Delete</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}