'use client'

import { useState, useEffect } from 'react'

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  bg:       '#060a14',
  bgCard:   '#0b1020',
  bgHover:  '#0f1528',
  bgSel:    '#131b30',
  border:   '#1a2236',
  borderMd: '#252f45',
  text:     '#f0f4ff',
  muted:    '#4b5878',
  sub:      '#8a96b0',
  accent:   '#2563eb',
  accentHv: '#1d4ed8',
  holiday:  '#ef4444',
}

const ROUTES = {
  balance:   { label: 'Balance',   dot: '#22c55e', bg: 'rgba(34,197,94,0.12)',  text: '#86efac' },
  stocks:    { label: 'Stocks',    dot: '#3b82f6', bg: 'rgba(59,130,246,0.12)', text: '#93c5fd' },
  summary:   { label: 'Summary',   dot: '#f59e0b', bg: 'rgba(245,158,11,0.12)', text: '#fcd34d' },
  workplace: { label: 'Workplace', dot: '#14b8a6', bg: 'rgba(20,184,166,0.12)', text: '#5eead4' },
  team:      { label: 'Team',      dot: '#a78bfa', bg: 'rgba(167,139,250,0.12)',text: '#c4b5fd' },
  general:   { label: 'General',   dot: '#6b7280', bg: 'rgba(107,114,128,0.12)',text: '#9ca3af' },
}

const EV_TYPES = ['production','maintenance','meeting','deadline','inspection','other']
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Accurate BS Calendar Engine (2079 - 2090) ────────────────────────────────
const BS_MONTH_DAYS = {
  2079: [31,31,32,31,31,31,30,29,30,29,30,30],
  2080: [31,31,32,32,31,30,30,29,30,29,30,31],
  2081: [31,31,32,31,31,31,30,29,30,29,30,30],
  2082: [31,32,31,32,31,30,30,30,29,29,30,30],
  2083: [31,31,32,31,31,30,30,30,29,30,30,30],
  2084: [31,31,32,32,31,30,30,29,30,29,30,30],
  2085: [31,32,31,32,31,30,30,29,30,29,30,30],
  2086: [31,32,31,32,31,30,30,29,30,29,30,30],
  2087: [31,31,32,31,32,30,30,30,29,29,30,30],
  2088: [31,31,32,31,31,31,30,29,30,29,30,30],
  2089: [31,32,31,32,31,30,30,30,29,29,30,31],
  2090: [31,31,32,31,31,30,30,30,29,30,30,30],
}

const BS_YEAR_START = {
  2079: new Date(2022, 3, 14, 12),
  2080: new Date(2023, 3, 14, 12),
  2081: new Date(2024, 3, 13, 12),
  2082: new Date(2025, 3, 14, 12),
  2083: new Date(2026, 3, 14, 12),
  2084: new Date(2027, 3, 14, 12),
  2085: new Date(2028, 3, 13, 12),
  2086: new Date(2029, 3, 14, 12),
  2087: new Date(2030, 3, 14, 12),
  2088: new Date(2031, 3, 14, 12),
  2089: new Date(2032, 3, 13, 12),
  2090: new Date(2033, 3, 14, 12),
}

const BS_MONTHS_EN = ['Baisakh','Jestha','Ashadh','Shrawan','Bhadra','Ashwin','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra']
const BS_MONTHS_NP = ['बैशाख','जेठ','असार','साउन','भदौ','असोज','कार्तिक','मंसिर','पुष','माघ','फागुन','चैत']
const AD_MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']

function adToBS(adDate) {
  const targetTime = new Date(adDate.getFullYear(), adDate.getMonth(), adDate.getDate(), 12).getTime();
  const years = Object.keys(BS_YEAR_START).map(Number).sort();
  let bsYear = years[0];
  
  for (const y of years) {
    if (targetTime >= BS_YEAR_START[y].getTime()) bsYear = y;
    else break;
  }
  
  if (!BS_MONTH_DAYS[bsYear]) return { year: bsYear, month: 1, day: 1 };
  
  let offset = Math.round((targetTime - BS_YEAR_START[bsYear].getTime()) / 86400000);
  const md = BS_MONTH_DAYS[bsYear];
  let m = 0;
  
  while (m < 12 && offset >= md[m]) { offset -= md[m]; m++; }
  return { year: bsYear, month: m + 1, day: offset + 1 };
}

function bsToAd(bsYear, bsMonth, bsDay) {
  if (!BS_YEAR_START[bsYear] || !BS_MONTH_DAYS[bsYear]) return new Date();
  let adDate = new Date(BS_YEAR_START[bsYear].getTime());
  let daysToAdd = 0;
  for (let m = 1; m < bsMonth; m++) { daysToAdd += BS_MONTH_DAYS[bsYear][m - 1]; }
  daysToAdd += (bsDay - 1);
  adDate.setDate(adDate.getDate() + daysToAdd);
  return adDate;
}

const SPECIAL_HOLIDAYS = {
  '2026-02-26': { name: 'Maha Shivaratri' },
  '2026-03-14': { name: 'Holi' },
  '2026-04-14': { name: 'Naya Barsha 2083' },
  '2026-09-03': { name: 'Teej' },
  '2026-09-17': { name: 'Ghatasthapana' },
  '2026-09-26': { name: 'Vijaya Dashami' },
  '2026-10-30': { name: 'Laxmi Puja' },
  '2026-11-04': { name: 'Bhai Tika' },
  '2026-11-07': { name: 'Chhath Parva' },
}

const dateKey = (d) => {
  const local = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
  return local.toISOString().split('T')[0];
}

function getDayInfo(adDate) {
  const bs = adToBS(adDate);
  const isSat = adDate.getDay() === 6;
  const key = dateKey(adDate);
  const festival = SPECIAL_HOLIDAYS[key] || null;
  return {
    bsYear: bs.year, bsMonth: bs.month, bsDay: bs.day,
    bsMonthEN: BS_MONTHS_EN[bs.month - 1], bsMonthNP: BS_MONTHS_NP[bs.month - 1],
    adDay: adDate.getDate(), adYear: adDate.getFullYear(), adMonth: adDate.getMonth(),
    isSaturday: isSat, festival, isHoliday: isSat || !!festival,
    key
  }
}

const INITIAL_EVENTS = [
  { id:1, date:'2026-06-03', title:'Monthly P&L review', route:'balance', type:'meeting', note:'Finalize figures' },
  { id:2, date:'2026-06-05', title:'Inventory count', route:'stocks', type:'inspection', note:'' },
]

// ─── Compact Styles ───────────────────────────────────────────────────────────
const s = {
  page:      { minHeight:'100vh', background:T.bg, color:T.text, fontFamily:"'Inter', sans-serif", padding:'16px 24px' },
  row:       { display:'flex', alignItems:'center', gap:10 },
  grid7:     { display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1, background:T.border, border:`1px solid ${T.border}`, borderRadius:8, overflow:'hidden' },
  two:       { display:'grid', gridTemplateColumns:'1fr 300px', gap:12, alignItems:'start' },
  card:      { background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:8, padding:'14px 16px' },
  label:     { fontSize:11, color:T.sub, marginBottom:3, display:'block' },
  btnNav:    { background:'transparent', color:T.sub, border:`1px solid ${T.border}`, padding:'4px 8px', borderRadius:6, cursor:'pointer', fontSize:12 },
  btnGhost:  { background:'transparent', color:T.sub, border:`1px solid ${T.border}`, padding:'4px 10px', borderRadius:6, cursor:'pointer', fontSize:12 },
  btnDash:   { width:'100%', marginTop:8, background:'transparent', border:`1px dashed ${T.borderMd}`, color:T.sub, padding:'8px', borderRadius:6, cursor:'pointer', fontSize:12, display:'flex', justifyContent:'center', alignItems:'center', gap:6 },
  btnSave:   { background:T.accent, color:'#fff', border:'none', padding:'7px 12px', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:500, flex:1 },
  btnCancel: { background:'transparent', color:T.sub, border:`1px solid ${T.border}`, padding:'7px 12px', borderRadius:6, cursor:'pointer', fontSize:12 },
  input:     { width:'100%', background:T.bgHover, border:`1px solid ${T.border}`, borderRadius:6, padding:'6px 8px', color:T.text, fontSize:12, outline:'none', boxSizing:'border-box' },
  select:    { width:'100%', background:T.bgHover, border:`1px solid ${T.border}`, borderRadius:6, padding:'6px 8px', color:T.text, fontSize:12, outline:'none', boxSizing:'border-box' },
  textarea:  { width:'100%', background:T.bgHover, border:`1px solid ${T.border}`, borderRadius:6, padding:'6px 8px', color:T.text, fontSize:12, outline:'none', resize:'none', boxSizing:'border-box' },
}

// ─── Components ───────────────────────────────────────────────────────────────
function RouteBadge({ route }) {
  const r = ROUTES[route] || ROUTES.general
  return <span style={{ padding:'2px 6px', borderRadius:8, fontSize:9, fontWeight:600, background:r.bg, color:r.text }}>{r.label}</span>
}

function DayCell({ info, events, isOtherMonth, isToday, isSelected, onClick, mode }) {
  const [hovered, setHovered] = useState(false);
  const bg = isSelected ? T.bgSel : hovered ? T.bgHover : T.bgCard;
  const primaryColor = info.isHoliday ? T.holiday : (isSelected ? T.text : '#fff');
  
  const bigNum = mode === 'BS' ? info.bsDay : info.adDay;
  const smallNum = mode === 'BS' ? info.adDay : info.bsDay;

  return (
    <div
      onClick={() => onClick(info.key)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background:bg, padding:'4px 6px', minHeight:68, cursor:'pointer', opacity:isOtherMonth?0.35:1, transition:'all .1s', borderLeft:isSelected?`2px solid ${T.accent}`:'2px solid transparent', display:'flex', flexDirection:'column' }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        {isToday ? (
          <span style={{ display:'flex', alignItems:'center', justifyContent:'center', width:22, height:22, background:info.isHoliday?T.holiday:T.accent, color:'#fff', borderRadius:'50%', fontSize:12, fontWeight:700 }}>
            {bigNum}
          </span>
        ) : (
          <span style={{ fontSize:14, fontWeight:700, color:primaryColor, lineHeight:1.1 }}>
            {bigNum}
          </span>
        )}
        <span style={{ fontSize:10, color:info.isHoliday ? '#fca5a5' : T.muted, fontWeight:600, marginTop:1 }}>
          {smallNum}
        </span>
      </div>

      {info.festival && (
        <div style={{ fontSize:8, color:T.holiday, background:'rgba(239,68,68,0.08)', padding:'1px 3px', borderRadius:3, marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontWeight:600 }} title={info.festival.name}>
          🚩 {info.festival.name}
        </div>
      )}

      <div style={{ display:'flex', gap:2, flexWrap:'wrap', marginTop:'auto', paddingTop:4 }}>
        {events.slice(0,5).map((ev,i) => (
          <span key={i} style={{ width:5, height:5, borderRadius:'50%', background:(ROUTES[ev.route]||ROUTES.general).dot }} title={ev.title} />
        ))}
        {events.length > 5 && <span style={{ fontSize:8, color:T.muted, fontWeight:'bold', lineHeight:0.5 }}>+</span>}
      </div>
    </div>
  )
}

function EventCard({ ev, onDelete }) {
  return (
    <div style={{ padding:'8px 10px', borderRadius:6, border:`1px solid ${T.border}`, marginBottom:6, background:T.bgHover }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:6 }}>
        <span style={{ fontSize:12, fontWeight:500, color:T.text, lineHeight:1.2 }}>{ev.title}</span>
        <button onClick={() => onDelete(ev.id)} style={{ background:'none', border:'none', color:T.muted, cursor:'pointer', padding:0, fontSize:12, flexShrink:0 }}>✕</button>
      </div>
      <div style={{ marginTop:4, display:'flex', gap:5, alignItems:'center' }}>
        <RouteBadge route={ev.route} />
        <span style={{ fontSize:10, color:T.muted }}>{ev.type}</span>
      </div>
      {ev.note && <p style={{ fontSize:10, color:T.sub, margin:'4px 0 0' }}>{ev.note}</p>}
    </div>
  )
}

function AddEventForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ title:'', route:'general', type:'production', note:'' })
  const set = (k,v) => setForm(f => ({...f,[k]:v}))
  
  return (
    <form onSubmit={e => { e.preventDefault(); if (!form.title.trim()) return; onSave(form) }} style={{ marginTop:10, borderTop:`1px solid ${T.border}`, paddingTop:10 }}>
      <div style={{ marginBottom:8 }}>
        <label style={s.label}>Event title</label>
        <input autoFocus required style={s.input} placeholder="e.g. Batch #42 started" value={form.title} onChange={e => set('title',e.target.value)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
        <div>
          <label style={s.label}>Route</label>
          <select style={s.select} value={form.route} onChange={e => set('route',e.target.value)}>
            {Object.entries(ROUTES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={s.label}>Type</label>
          <select style={s.select} value={form.type} onChange={e => set('type',e.target.value)}>
            {EV_TYPES.map(t => <option key={t} value={t}>{t[0].toUpperCase()+t.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom:10 }}>
        <label style={s.label}>Note (optional)</label>
        <textarea rows={2} style={s.textarea} placeholder="Additional details..." value={form.note} onChange={e => set('note',e.target.value)} />
      </div>
      <div style={{ display:'flex', gap:6 }}>
        <button type="submit" style={s.btnSave}>Save event</button>
        <button type="button" onClick={onCancel} style={s.btnCancel}>Cancel</button>
      </div>
    </form>
  )
}

function DayPanel({ selectedDate, events, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);

  // Reset form state when a new date is selected
  useEffect(() => { setShowForm(false) }, [selectedDate]);

  if (!selectedDate) return <div style={{...s.card, textAlign:'center', color:T.muted, fontSize:12, padding:'24px 16px'}}>Select a day to view/add events</div>
  
  const [y,m,d] = selectedDate.split('-').map(Number);
  const info = getDayInfo(new Date(y, m-1, d, 12));
  const dayEvs = events.filter(e => e.date === selectedDate);

  return (
    <div style={s.card}>
      <div style={{ marginBottom:12 }}>
        <p style={{ fontSize:16, fontWeight:700, color:info.isHoliday?T.holiday:T.text, margin:0 }}>
          {info.bsMonthNP} {info.bsDay}, {info.bsYear} <span style={{fontSize:11, color:T.sub}}>BS</span>
        </p>
        <p style={{ fontSize:11, color:T.sub, marginTop:2 }}>
          {AD_MONTHS_EN[info.adMonth]} {info.adDay}, {info.adYear}
        </p>
      </div>
      
      {info.isHoliday && (
        <div style={{ background:'rgba(239,68,68,0.1)', padding:'6px 10px', borderRadius:6, marginBottom:12, display:'flex', alignItems:'center', gap:6, border:`1px solid rgba(239,68,68,0.2)` }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:T.holiday }} />
          <span style={{ fontSize:11, fontWeight:600, color:T.holiday }}>{info.isSaturday && !info.festival ? 'Factory Holiday (Sat)' : info.festival?.name}</span>
        </div>
      )}

      <div style={{ maxHeight: showForm ? '140px' : '300px', overflowY:'auto', paddingRight:4, marginBottom:8 }}>
        {dayEvs.length === 0 ? (
           <p style={{ fontSize:11, color:T.muted, textAlign:'center', margin:'10px 0' }}>No logs for this date</p>
        ) : dayEvs.map(ev => <EventCard key={ev.id} ev={ev} onDelete={onDelete} />)}
      </div>

      {showForm ? (
        <AddEventForm 
          onSave={form => { onAdd({...form, date:selectedDate, id:Date.now()}); setShowForm(false); }} 
          onCancel={() => setShowForm(false)} 
        />
      ) : (
        <button onClick={() => setShowForm(true)} style={s.btnDash}>+ Add schedule event</button>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductionCalendarPage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('BS'); 
  const [adFocus, setAdFocus] = useState({ year: 2026, month: 5 }); 
  const [bsFocus, setBsFocus] = useState({ year: 2083, month: 3 }); 
  const [selDate, setSelDate] = useState('');
  const [events, setEvents] = useState(INITIAL_EVENTS);

  useEffect(() => {
    const today = new Date();
    setAdFocus({ year: today.getFullYear(), month: today.getMonth() });
    const bsToday = adToBS(today);
    setBsFocus({ year: bsToday.year, month: bsToday.month });
    setSelDate(dateKey(today));
    setMounted(true);
  }, []);

  if (!mounted) return <div style={s.page} />

  const handleToggle = (newMode) => {
    if (newMode === mode) return;
    if (newMode === 'BS') {
      const midAD = new Date(adFocus.year, adFocus.month, 15, 12);
      const bs = adToBS(midAD);
      setBsFocus({ year: bs.year, month: bs.month });
    } else {
      const midBS = bsToAd(bsFocus.year, bsFocus.month, 15);
      setAdFocus({ year: midBS.getFullYear(), month: midBS.getMonth() });
    }
    setMode(newMode);
  }

  const prevMonth = () => {
    if (mode === 'AD') {
      let m = adFocus.month - 1, y = adFocus.year;
      if (m < 0) { m = 11; y--; }
      setAdFocus({ year: y, month: m });
    } else {
      let m = bsFocus.month - 1, y = bsFocus.year;
      if (m < 1) { m = 12; y--; }
      setBsFocus({ year: y, month: m });
    }
  }

  const nextMonth = () => {
    if (mode === 'AD') {
      let m = adFocus.month + 1, y = adFocus.year;
      if (m > 11) { m = 0; y++; }
      setAdFocus({ year: y, month: m });
    } else {
      let m = bsFocus.month + 1, y = bsFocus.year;
      if (m > 12) { m = 1; y++; }
      setBsFocus({ year: y, month: m });
    }
  }

  const jumpToday = () => {
    const today = new Date();
    setAdFocus({ year: today.getFullYear(), month: today.getMonth() });
    const bsToday = adToBS(today);
    setBsFocus({ year: bsToday.year, month: bsToday.month });
    setSelDate(dateKey(today));
  }

  const addEvent = (ev) => setEvents(prev => [...prev, ev]);
  const delEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  const cells = [];
  let displayTitle = "";
  let displaySubtitle = "";

  if (mode === 'AD') {
    const firstDay = new Date(adFocus.year, adFocus.month, 1, 12).getDay();
    const daysInMonth = new Date(adFocus.year, adFocus.month + 1, 0).getDate();
    for (let i = firstDay; i > 0; i--) cells.push({ date: new Date(adFocus.year, adFocus.month, 1 - i, 12), other: true });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(adFocus.year, adFocus.month, d, 12), other: false });
    const rem = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= rem; d++) cells.push({ date: new Date(adFocus.year, adFocus.month + 1, d, 12), other: true });

    displayTitle = `${AD_MONTHS_EN[adFocus.month]} ${adFocus.year}`;
    const midBS = adToBS(new Date(adFocus.year, adFocus.month, 15, 12));
    displaySubtitle = `${BS_MONTHS_EN[midBS.month - 1]} ${midBS.year} BS`;
  } else {
    const startAD = bsToAd(bsFocus.year, bsFocus.month, 1);
    const firstDay = startAD.getDay();
    const daysInMonth = BS_MONTH_DAYS[bsFocus.year] ? BS_MONTH_DAYS[bsFocus.year][bsFocus.month - 1] : 30;
    for (let i = firstDay; i > 0; i--) cells.push({ date: new Date(startAD.getTime() - (i * 86400000)), other: true });
    for (let d = 0; d < daysInMonth; d++) cells.push({ date: new Date(startAD.getTime() + (d * 86400000)), other: false });
    const rem = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= rem; d++) {
      const lastDay = new Date(startAD.getTime() + ((daysInMonth - 1) * 86400000));
      cells.push({ date: new Date(lastDay.getTime() + (d * 86400000)), other: true });
    }

    displayTitle = `${BS_MONTHS_NP[bsFocus.month - 1]} / ${BS_MONTHS_EN[bsFocus.month - 1]} ${bsFocus.year}`;
    const midAD = bsToAd(bsFocus.year, bsFocus.month, 15);
    displaySubtitle = `${AD_MONTHS_EN[midAD.getMonth()]} ${midAD.getFullYear()} AD`;
  }

  const todayKey = dateKey(new Date());

  return (
    <div style={s.page}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:700, color:T.text, margin:0 }}>Production Scheduler</h1>
        </div>

        <div style={{ display:'flex', gap:4, background:T.bgHover, padding:3, borderRadius:6, border:`1px solid ${T.borderMd}` }}>
          <button onClick={() => handleToggle('AD')} style={{ padding:'5px 12px', borderRadius:4, background:mode==='AD'?T.accent:'transparent', color:mode==='AD'?'#fff':T.sub, border:'none', cursor:'pointer', fontSize:11, fontWeight:600, transition:'0.2s' }}>AD</button>
          <button onClick={() => handleToggle('BS')} style={{ padding:'5px 12px', borderRadius:4, background:mode==='BS'?T.accent:'transparent', color:mode==='BS'?'#fff':T.sub, border:'none', cursor:'pointer', fontSize:11, fontWeight:600, transition:'0.2s' }}>BS</button>
        </div>
      </div>

      <div style={{ ...s.row, marginBottom:16 }}>
        <button onClick={prevMonth} style={s.btnNav}>‹</button>
        <div style={{ minWidth:200, textAlign:'center' }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.text }}>{displayTitle}</div>
          <div style={{ fontSize:11, color:T.muted, marginTop:1, fontWeight:500 }}>{displaySubtitle}</div>
        </div>
        <button onClick={nextMonth} style={s.btnNav}>›</button>
        <button onClick={jumpToday} style={{ ...s.btnGhost, marginLeft:8 }}>Today</button>
      </div>

      <div style={s.two}>
        <div>
          <div style={s.grid7}>
            {WEEKDAYS.map(d => (
              <div key={d} style={{ background:T.bgCard, padding:'8px 0', fontSize:11, fontWeight:600, color:d==='Sat'?T.holiday:T.muted, textAlign:'center', borderBottom:`1px solid ${T.border}` }}>
                {d}
              </div>
            ))}
            {cells.map(({ date, other }) => {
              const info = getDayInfo(date);
              return (
                <DayCell
                  key={info.key}
                  info={info}
                  events={events.filter(e => e.date === info.key)}
                  isOtherMonth={other}
                  isToday={info.key === todayKey}
                  isSelected={info.key === selDate}
                  onClick={setSelDate}
                  mode={mode}
                />
              )
            })}
          </div>
        </div>

        <div>
          <DayPanel 
            selectedDate={selDate} 
            events={events} 
            onAdd={addEvent}
            onDelete={delEvent} 
          />
        </div>
      </div>
    </div>
  )
}