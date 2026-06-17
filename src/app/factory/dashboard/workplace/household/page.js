'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function HouseholdWorkplace() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAddLogMode = searchParams.get('add-log') === 'true';
  const searchModel = searchParams.get('searchModel');

  const [productionLogs, setProductionLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Inline dynamic dashboard quick editing states
  const [editingLogId, setEditingLogId] = useState(null);
  const [inlineQuantity, setInlineQuantity] = useState('');

  // Filtering dashboard listing states
  const [filterItem, setFilterItem] = useState('ALL');
  const [filterMachine, setFilterMachine] = useState('ALL');
  const [filterColor, setFilterColor] = useState('ALL');
  const [sortBy, setSortBy] = useState('LATEST');

  // Machine Models and Colors Configuration
  const machineModels = ["MM-100", "MM-150-A", "MM-150-B", 'MM-200', 'MM-250', 'MM-350', 'MM-450', 'MM-6270', 'MM-8800', 'MM-800'];
  const colorColumns = ["RED", "BLU", "PGN", "BRN", "BGE", "WHITE", "RWD", "SGY", "SWD", "ORG", "BLACK", "PINK", "PURPLE", "YLW"];

  // Custom Household Category Filters requested by you
  const categoriesList = ["ALL", "HOUSEHOLD ITEMS", "LOOSE ITEMS", "1555871"];

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedMachine, setSelectedMachine] = useState("MM-100");
  const [productionDate, setProductionDate] = useState(new Date().toISOString().split('T')[0]);

  // Matrix Memory Allocation Structure tracking multiple machines at once
  const [matrixState, setMatrixState] = useState({});

  // Comprehensive Data Lists
  const looseItemsList = [
    "Swing Flap – 1201", "Swing Ring – 1201", "Lid – 1201", "MPC Body – 1201", "MPC / Swing Bin – 1201 (Handle)",
    "Swing Ring – 35 Ltr.", "Flap – 35 Ltr.", "Swing Ring – 40 Ltr.", "Flap – 40 Ltr.", "Swing Ring – 50 Ltr.",
    "Flap – 50 Ltr.", "40 Ltr. Bucket / Drum Lock", "40 Ltr. Bucket / Drum Handle", "Jug Body – 1.25",
    "Jug Lid 1.25 & 201", "Jug Body – 201", "Jug – 202 Colour", "Jug – 202 Rand.", "Jug Lid – 202",
    "Masala Box (Lid) 111", "Masala Box (Only Box)", "Masala Box Batti", "Masala Box 2400 Badi Center",
    "Masala Box 2400 Side", "Masala Box 2400 Spoon", "Pedal Bin – 107 Handle", "Pedal Bin – 107 Leg Step",
    "Pedal Bin – 107 Liver / Back Stick", "Pedal Bin – 107 Lid", "Pedal Bin – 107 Body", "Pedal Bin – 108 Handle",
    "Pedal Bin – 108 Leg Step", "Pedal Bin – 108 Liver / Back Stick", "Pedal Bin – 108 Lid", "Pedal Bin – 108 Body",
    "MP Rect. Body", "MP Flower Body", "MP Flower / Rect. – Long Leg", "MP Flower / Rect. – Short Leg",
    "MP Flower / Rect. – Cap", "SF – 1700 Body", "SF – 1400 Body", "SF – 2400 Body", "SF – 3800 Body",
    "SF – 3000 Body", "SF – 5000 Body", "SF – 7000 Body", "SF – 10000 Body", "SF – 3000 Lid",
    "SF – 5000 / 1400 / 1700 Lid", "SF – 7000 / 2400 Lid", "SF – 10000 / 3800 Lid", "Lunch Box Body – I",
    "Lunch Box Body – A", "Lunch Box Body – 4", "Lunch Box Lid – I", "Lunch Box Lid – A", "Lunch Box Lid – 4",
    "Lunch Box Batti", "Lunch Box Spoon", "Mini Basket Handle", "Mini Basket Ring", "Mini Basket Body",
    "Fancy Basket Body", "Fancy Basket Lid", "Coat Hanger – G11", "Coat Hook – G11", "Lunch Box Batti – Lid",
    "Utility Pen Stand – 100 Body", "Utility Stand – 100 Ring", "Set SCOOOO Body", "Set SCOOOO Lid",
    "Set SCOOOO Handle", "Car Pot – 777", "Multi Storage Box – I", "Multi Storage Box – A", "Multi Storage Box – 4",
    "Multi Storage Box – I Lid", "Multi Storage Box – A Lid", "Multi Storage Box – 4 Lid", "Launda Basket – 1200 Body",
    "Launda Basket – 1200 Lid", "Car Pot – 777 Body", "Car Pot – 777 Lid", "Mini Basket – Batti",
    "Utility Stand – 100 Body", "Utility Stand – 100 Ring", "Set SCOOOO Body (Spare)", "Set SCOOOO Lid (Spare)",
    "Set SCOOOO Handle (Spare)", "Lunch Box Body (Spare)", "Lunch Box Lid (Spare)", "Lunch Box Spoon (Spare)"
  ];

  const generic155List = [
    "Jug – 125", "Jug – 201", "Jug – 202 Colour", "Jug – 202 Rand.", "Masala Box – Dlx. 111",
    "Masala Box – 2400", "MPC with Lid – 1201", "Pedal Bin Set – 107", "Pedal Bin Set – 108",
    "MP Rect. Rack – 3 Step", "MP Rect. Rack – 4 Step", "MP Flower Rack – 3 Step", "MP Flower Rack – 4 Step"
  ];

  const householdItemsList = [
    "Bucket 5 Ltr.", "Bucket 8 Ltr.", "Bucket 10 Ltr.", "Bucket 13 Ltr.", "Bucket 15 Ltr.", "Bucket 17 Ltr.",
    "Bucket 20 Ltr.", "Bucket 25 Ltr.", "Lid 5 Ltr.", "Lid 8 Ltr.", "Lid 10 Ltr.", "Lid 13 Ltr.", "Lid 15 Ltr.",
    "Lid 17 Ltr.", "Lid 20 Ltr.", "Lid 25 Ltr.", "Basin Wave 7″", "Basin Wave 9″", "Basin Wave 11″", "Basin 13″",
    "Basin 15″", "Basin 17.5″", "Basin 19″", "Basin 21″", "Basin Deluxe 17″", "Basin Deluxe 20″", "Ghemela 20″ (2001)",
    "Tab 40 Ltr. (2440)", "Mug – 075", "Mug – 101", "Mug – 102", "Mug – 151", "Strainer 9″", "Strainer 11″",
    "Dust Pan – 111", "Dust Pan – 222", "Drum 35 Ltr.", "Drum 40 Ltr. (Sq.)", "Drum 50 Ltr.", "Lid 35 Ltr.",
    "Lid 40 Ltr. (Sq.)", "Lid 50 Ltr.", "MPC – 801", "MPC Step – 115", "Soap Dish 3 in 1", "Soap Dish – 701",
    "Soap Case – Rose", "Kitchen Tray – 410", "Kitchen Tray – 420", "Kitchen Tray – 510", "Kitchen Tray – 520",
    "Kitchen Tray – 530", "Kitchen Tray – 540", "Fruit Basket – 175", "Corner Rack", "Colander 13″",
    "Colander With Handle – 900", "Planter Nature 450", "Planter Nature 550", "Planter Nature 650",
    "Utility Stand 210", "Planter Nature 800", "Planter Nature 1000", "Planter Nature 1200", "Planter Plate Nature 800",
    "Planter Plate Nature 1000", "Planter Plate Nature 1200", "Planter Flora 800", "Planter Flora 1000",
    "Planter Plate Flora 800", "Planter Plate Flora 1000", "Hanger 901", "Hanger 902", "Wash Brush 255",
    "Nanglo 201", "Optical Case", "Hanging Planter Nature H701", "Hanging Planter – Nature H701",
    "Hanging Planter – Nature H901", "Planter – Nature H701", "Planter – Nature H901", "Planter Hanger – Nature",
    "Funnel – 401", "Funnel – 601", "Planter Hexa (120)", "Planter Hexa (160)", "Planter Hexa (200)",
    "Planter Pearl – 900", "Veg. Crate", "FB 1000 (Bottle)", "FB 1000 (Bottle) – D", "FB 2000 (Bottle)",
    "FB 2100 (Bottle)", "FB 3000 (Bottle)", "FB 3100 (Bottle)", "FB 3150 (Bottle)", "Dish Rack – 555",
    "Tray – 555", "Lubricant Cap (GR)"
  ];

  // Combined Master Dataset
  const householdAllItems = [...householdItemsList, ...looseItemsList, ...generic155List];

  const API_URL = "http://127.0.0.1:8000/api/factory/workplace/household";

  // Pre-load current logs into respective matrix allocations
  const loadExistingMatrixData = (currentLogs) => {
    const initialGrid = {};

    machineModels.forEach(m => {
      initialGrid[m] = {};
      householdAllItems.forEach(item => {
        initialGrid[m][item] = {};
        colorColumns.forEach(color => { initialGrid[m][item][color] = ""; });
      });
    });

    currentLogs.forEach(log => {
      if (log.production_date !== productionDate) return;

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

  // Cache-Busting Core Engine Sync
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
    } catch (err) { console.error("Household Sync Fail:", err); }
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
    // if (!window.confirm("Bhai, kya aap sach me is household production log ko delete karna chahte ho?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductionLogs(prev => prev.filter(log => log.id !== id));
      }
    } catch (err) { console.error("Purge Error:", err); }
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
    } catch (err) { console.error("Inline Change Error:", err); }
  };

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

  // Dynamic Routing category matching for active sheet grid rows
  const filteredHouseholdItems = householdAllItems.filter(item => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "HOUSEHOLD ITEMS") return householdItemsList.includes(item);
    if (activeCategory === "LOOSE ITEMS") return looseItemsList.includes(item);
    if (activeCategory === "1555871") return generic155List.includes(item);
    return true;
  });

  // Parallel Batch Async Multi-Machine Ledger Commit Engine
  const handleBulkMatrixSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let operationsSuccess = true;

      for (const machine of machineModels) {
        for (const item of householdAllItems) {
          for (const color of colorColumns) {

            const quantity = parseInt(matrixState[machine]?.[item]?.[color]);
            const keyString = `${item} (${color})`;

            const existingLog = productionLogs.find(log =>
              log.particulars === keyString &&
              log.machine_model === machine &&
              log.production_date === productionDate
            );

            if (quantity && quantity > 0) {
              if (existingLog) {
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
          router.push("/factory/dashboard/workplace/household");
        }, 150);
      } else {
        alert("Server validation errors encountered on some batch blocks.");
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  // Processing listing filters for standard workspace logs grid
  const processedLogs = productionLogs
    .filter(log => {
      if (!log.particulars) return false;
      const matchesSearch = searchModel ? log.particulars.toLowerCase().includes(searchModel.toLowerCase()) : true;

      let matchesItemType = true;
      if (filterItem !== 'ALL') {
        const pureName = log.particulars.split(" (")[0].trim();
        if (filterItem === 'HOUSEHOLD ITEMS') matchesItemType = householdItemsList.includes(pureName);
        else if (filterItem === 'LOOSE ITEMS') matchesItemType = looseItemsList.includes(pureName);
        else if (filterItem === '1555871') matchesItemType = generic155List.includes(pureName);
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
            <h2 className="text-xl font-bold text-white tracking-tight">Household Bulk Production Ledger</h2>
            <p className="text-xs text-gray-400 mt-1">Memory locked cross-machine engine state tracking operational parameters.</p>
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
                  <th className="p-3 border-b border-gray-800 bg-[#532805] sticky left-0 z-40 min-w-[240px]">Household Variant Catalog</th>
                  {colorColumns.map(color => <th key={color} className="p-2 text-center border-b border-l border-gray-800/60 min-w-[65px] font-mono text-[11px]">{color}</th>)}
                  <th className="p-3 text-right border-b border-l border-gray-800 bg-[#3a1d04] sticky right-0 z-40 min-w-[80px]">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouseholdItems.map((item, itemIdx) => {
                  const totalCount = getRowTotal(item);
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
            <button type="button" onClick={() => router.push("/factory/dashboard/workplace/household")} className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-gray-800 transition">Cancel & Exit</button>
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 transition">{saving ? "🔄 Committing Multi-Machine Data..." : "💾 Save All Machine Records"}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#111625] p-4 rounded-xl border border-gray-800">
        <div>
          <h1 className="text-lg font-black text-white uppercase tracking-wider">Household Line Logging</h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time dynamic visualization grid of current batch logs</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wide">Dynamic Line Filter</span>
            <select value={filterItem} onChange={(e) => setFilterItem(e.target.value)} className="bg-[#0b0f19] border border-gray-800 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-300 focus:outline-none focus:border-indigo-600 font-semibold">
              <option value="ALL">All Departments</option>
              <option value="HOUSEHOLD ITEMS">Household Items</option>
              <option value="LOOSE ITEMS">Loose Items</option>
              <option value="1555871">Code Section: 1555871</option>
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
            <span className="text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wide">Sort Engine</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#0b0f19] border border-gray-800 rounded-lg px-2.5 py-1.5 text-[11px] text-amber-500 border-amber-900/40 focus:outline-none font-bold">
              <option value="LATEST">Latest Dynamic entry</option>
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
            <thead className="sticky top-0 z-30 bg-[#532805] shadow-md">
              <tr className="border-b border-gray-800 text-white uppercase tracking-wider text-xl font-bold">
                <th className="p-4">Production Model Name</th>
                <th className="p-4 text-center">Output Metric (Quantity)</th>
                <th className="p-4 text-center">Machine Model</th>
                <th className="p-4 text-center">Run Log Timestamp</th>
                <th className="p-4 text-right pr-6">Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-12 text-center text-gray-400 animate-pulse font-mono">🔄 Syncing core operational database metrics...</td></tr>
              ) : processedLogs.length === 0 ? (
                <tr><td colSpan="5" className="p-12 text-center text-gray-500 font-mono">❌ No matched industrial logs found.</td></tr>
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
                    <td className="p-4 text-center"><span className="px-2 py-0.5 rounded bg-gray-800/80 border border-gray-700/60 text-gray-300 font-mono">{log.machine_model || "N/A"}</span></td>
                    <td className="p-4 text-center text-gray-400 font-mono">{log.production_date || "Unknown"}</td>
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