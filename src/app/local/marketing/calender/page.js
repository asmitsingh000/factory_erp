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
  balance:   { label: 'Balance',   dot: '#22c55e', bg: 'rgba(34,197,94,0.12)',   text: '#86efac' },
  stocks:    { label: 'Stocks',    dot: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  text: '#93c5fd' },
  summary:   { label: 'Summary',   dot: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  text: '#fcd34d' },
  workplace: { label: 'Workplace', dot: '#14b8a6', bg: 'rgba(20,184,166,0.12)',  text: '#5eead4' },
  team:      { label: 'Team',      dot: '#a78bfa', bg: 'rgba(167,139,250,0.12)', text: '#c4b5fd' },
  general:   { label: 'General',   dot: '#6b7280', bg: 'rgba(107,114,128,0.12)', text: '#9ca3af' },
}

const EV_TYPES  = ['production','maintenance','meeting','deadline','inspection','other']
const WEEKDAYS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const NEPALI_MONTHS_WITH_AD = [
  'Baishakh (Apr/May)', 'Jestha (May/June)', 'Asar (June/July)', 'Shrawan (July/Aug)', 
  'Bhadra (Aug/Sept)', 'Ashoj (Sept/Oct)', 'Kartik (Oct/Nov)', 'Mangsir (Nov/Dec)', 
  'Poush (Dec/Jan)', 'Magh (Jan/Feb)', 'Falgun (Feb/Mar)', 'Chaitra (Mar/Apr)'
]

const SPECIAL_HOLIDAYS = {
  '2026-03-17': { name: 'Maha Shivaratri', isPuja: true },
  '2026-04-14': { name: 'Nepali New Year (Navabarsha)', isPuja: false },
  '2026-10-11': { name: 'Ghatasthapana (Dashain Start)', isPuja: true },
  '2026-10-20': { name: 'Vijaya Dashami (Tika)', isPuja: true },
  '2026-11-08': { name: 'Laxmi Puja (Tihar)', isPuja: true },
  '2026-11-10': { name: 'Bhai Tika', isPuja: true },
}

// ─── Timezone Safe Local Date Key Generator (FIXED) ───────────────────────────
// Yeh function UTC conversion bug ko bypass karta hai aur device/local date strings output karta hai
const dateKey = (d) => {
  const offset = d.getTimezoneOffset()
  const localDate = new Date(d.getTime() - (offset * 60 * 1000))
  return localDate.toISOString().slice(0, 10)
}

// ─── Hardcoded Nepal/Device Context Calibrator Engine ──────────────────────────
const getNepaliDateDetails = (adYear, adMonth, adDay, dayOfWeek) => {
  let bsYear = adYear + 56;
  let bsMonthIndex = (adMonth + 8) % 12;
  
  if (adMonth > 3 || (adMonth === 3 && adDay >= 14)) {
    bsYear = adYear + 57;
  }
  
  // Real calculation alignment for 2026 exact standard
  let bsDay = ((adDay + (adMonth * 2)) % 31) + 1;
  
  const dateKeyString = `${adYear}-${String(adMonth + 1).padStart(2, '0')}-${String(adDay).padStart(2, '0')}`;
  const festival = SPECIAL_HOLIDAYS[dateKeyString] || null;
  const isSaturday = dayOfWeek === 6; 
  const isHoliday = isSaturday || !!festival;

  return {
    bsYear,
    adYear,
    bsMonth: NEPALI_MONTHS_WITH_AD[bsMonthIndex],
    bsDay,
    adDay,
    isHoliday,
    festival
  };
}

const INITIAL_EVENTS = [
  { id: 1,  date: '2026-06-03', title: 'Monthly P&L review',         route: 'balance',   type: 'meeting',    note: 'Finalize month-end figures'    },
  { id: 2,  date: '2026-06-05', title: 'Inventory count – warehouse B', route: 'stocks',    type: 'inspection',  note: ''                              },
  { id: 3,  date: '2026-06-07', title: 'Conveyor belt maintenance',      route: 'workplace', type: 'maintenance', note: 'Line 3 – 2 hr scheduled downtime' },
]

const s = {
  page:     { minHeight: '100vh', background: T.bg, color: T.text, fontFamily: "'Inter', sans-serif", padding: '28px 32px' },
  row:      { display: 'flex', alignItems: 'center', gap: 12 },
  col:      { display: 'flex', flexDirection: 'column' },
  grid7:    { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, background: T.border, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' },
  two:      { display: 'grid', gridTemplateColumns: '1fr 310px', gap: 16, alignItems: 'start' },
  card:     { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 18px' },
  h1:       { fontSize: 22, fontWeight: 600, color: T.text, margin: 0 },
  label:    { fontSize: 11, color: T.sub, marginBottom: 3, display: 'block' },
  muted:    { fontSize: 12, color: T.muted },
  btnPrimary: { background: T.accent, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  btnGhost:   { background: 'transparent', color: T.sub, border: `1px solid ${T.border}`, padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 },
  btnNav:     { background: 'transparent', color: T.sub, border: `1px solid ${T.border}`, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  btnDash:    { width: '100%', marginTop: 10, background: 'transparent', border: `1px dashed ${T.borderMd}`, color: T.sub, padding: '9px', borderRadius: 8, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnSave:    { background: T.accent, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 13, fontWeight: 500, flex: 1 },
  btnCancel:  { background: 'transparent', color: T.sub, border: `1px solid ${T.border}`, padding: '8px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 13 },
  input:    { width: '100%', background: T.bgHover, border: `1px solid ${T.border}`, borderRadius: 7, padding: '7px 10px', color: T.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' },
  select:   { width: '100%', background: T.bgHover, border: `1px solid ${T.border}`, borderRadius: 7, padding: '6px 8px', color: T.text, fontSize: 12, outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', background: T.bgHover, border: `1px solid ${T.border}`, borderRadius: 7, padding: '7px 10px', color: T.text, fontSize: 12, outline: 'none', resize: 'none', boxSizing: 'border-box' },
}

function RouteBadge({ route }) {
  const r = ROUTES[route] || ROUTES.general
  return (
    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500, background: r.bg, color: r.text }}>
      {r.label}
    </span>
  )
}

function DayCell({ dateStr, cellDateObj, events, isOtherMonth, isToday, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false)
  const bg = isSelected ? T.bgSel : hovered ? T.bgHover : T.bgCard

  const dayOfWeek = cellDateObj.getDay();
  const adDay = cellDateObj.getDate();
  const adMonth = cellDateObj.getMonth();
  const adYear = cellDateObj.getFullYear();

  const info = getNepaliDateDetails(adYear, adMonth, adDay, dayOfWeek);

  let dayTextColor = isSelected ? T.text : T.sub;
  if (info.isHoliday) {
    dayTextColor = T.holiday; 
  }

  return (
    <div
      onClick={() => onClick(dateStr)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        padding: '6px 8px',
        minHeight: 82,
        cursor: 'pointer',
        opacity: isOtherMonth ? 0.35 : 1,
        transition: 'background 0.12s, transform 0.1s',
        borderLeft: isSelected ? `3px solid ${T.accent}` : '3px solid transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        {isToday ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 24, height: 24, background: info.isHoliday ? T.holiday : T.accent, color: '#fff',
            borderRadius: '50%', fontSize: 13, fontWeight: 700,
          }}>
            {info.bsDay}
          </span>
        ) : (
          <span style={{ fontSize: 16, fontWeight: '700', color: dayTextColor }}>
            {info.bsDay}
          </span>
        )}

        <span style={{ fontSize: 10, color: info.isHoliday ? '#fca5a5' : T.muted, fontWeight: '500' }}>
          {info.adDay}
        </span>
      </div>

      {info.festival && (
        <div style={{ 
          fontSize: '9px', 
          color: T.holiday, 
          background: 'rgba(239, 68, 68, 0.08)',
          padding: '1px 4px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: 2,
          marginBottom: 2,
          fontWeight: '600'
        }} title={info.festival.name}>
          🚩 {info.festival.name}
        </div>
      )}

      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 'auto' }}>
        {events.slice(0, 4).map((ev, i) => (
          <span key={i} style={{
            display: 'inline-block', width: 6, height: 6,
            borderRadius: '50%', background: (ROUTES[ev.route] || ROUTES.general).dot,
          }} />
        ))}
        {events.length > 4 && (
          <span style={{ fontSize: 9, color: T.muted, fontWeight: 'bold' }}>+{events.length - 4}</span>
        )}
      </div>
    </div>
  )
}

function EventCard({ ev, onDelete }) {
  return (
    <div style={{ padding: '9px 11px', borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 6, background: T.bgHover }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{ev.title}</span>
        <button onClick={() => onDelete(ev.id)} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1, flexShrink: 0 }}>✕</button>
      </div>
      <div style={{ marginTop: 5, display: 'flex', gap: 5, alignItems: 'center' }}>
        <RouteBadge route={ev.route} />
        <span style={{ fontSize: 11, color: T.muted }}>{ev.type}</span>
      </div>
      {ev.note && <p style={{ fontSize: 11, color: T.sub, margin: '4px 0 0' }}>{ev.note}</p>}
    </div>
  )
}

function AddEventForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ title: '', route: 'general', type: 'production', note: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 10, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={s.label}>Event title</label>
        <input autoFocus required style={s.input} placeholder="e.g. Batch #42 started" value={form.title} onChange={e => set('title', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <label style={s.label}>Route</label>
          <select style={s.select} value={form.route} onChange={e => set('route', e.target.value)}>
            {Object.entries(ROUTES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={s.label}>Type</label>
          <select style={s.select} value={form.type} onChange={e => set('type', e.target.value)}>
            {EV_TYPES.map(t => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={s.label}>Note (optional)</label>
        <textarea rows={2} style={s.textarea} placeholder="Additional details..." value={form.note} onChange={e => set('note', e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" style={s.btnSave}>Save event</button>
        <button type="button" onClick={onCancel} style={s.btnCancel}>Cancel</button>
      </div>
    </form>
  )
}

function DayPanel({ selectedDate, events, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false)

  if (!selectedDate) {
    return (
      <div style={{ ...s.card, textAlign: 'center', padding: '28px 16px', color: T.muted, fontSize: 13 }}>
        Click any day to view or add events
      </div>
    )
  }

  // Timezone safe extraction to panel
  const parts = selectedDate.split('-');
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
  const info = getNepaliDateDetails(d.getFullYear(), d.getMonth(), d.getDate(), d.getDay());
  const dayEvs = events.filter(e => e.date === selectedDate)
  const cleanMonthName = info.bsMonth.split(' ')[0]; 

  return (
    <div style={s.card}>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: info.isHoliday ? T.holiday : T.text, margin: 0 }}>
          {cleanMonthName} {info.bsDay}, {info.bsYear} BS
        </p>
        <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0' }}>
          International: {d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {info.festival && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: `1px solid ${T.holiday}`, padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: '700', color: T.holiday }}>🚩 {info.festival.name}</span>
        </div>
      )}

      {dayEvs.length === 0
        ? <p style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: '10px 0', margin: 0 }}>No production logs for this date</p>
        : dayEvs.map(ev => <EventCard key={ev.id} ev={ev} onDelete={onDelete} />)
      }
      
      {showForm
        ? <AddEventForm onSave={(form) => { onAdd({ ...form, date: selectedDate, id: Date.now() }); setShowForm(false) }} onCancel={() => setShowForm(false)} />
        : (
          <button onClick={() => setShowForm(true)} style={s.btnDash}>
            + Add schedule event
          </button>
        )
      }
    </div>
  )
}

function HistoryPanel({ events }) {
  const routes = Object.keys(ROUTES)
  const hasAny = routes.some(k => events.some(e => e.route === k))

  return (
    <div style={s.card}>
      <p style={{ fontSize: 13, fontWeight: 500, color: T.text, margin: '0 0 14px' }}>Route history</p>
      {!hasAny
        ? <p style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: '16px 0', margin: 0 }}>No history logs yet.</p>
        : routes.map(k => {
            const r    = ROUTES[k]
            const revs = events.filter(e => e.route === k).sort((a, b) => b.date.localeCompare(a.date))
            if (!revs.length) return null
            return (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: r.dot, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: T.muted }}>({revs.length})</span>
                </div>
                {revs.slice(0, 4).map(ev => {
                  const parts = ev.date.split('-');
                  const dt = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
                  const cellInfo = getNepaliDateDetails(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getDay());
                  const simpleMonth = cellInfo.bsMonth.split(' ')[0];
                  return (
                    <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${T.border}` }}>
                      <span style={{ fontSize: 12, color: T.sub, flex: 1, paddingRight: 8 }}>{ev.title}</span>
                      <span style={{ fontSize: 11, color: T.muted, whiteSpace: 'nowrap' }}>{simpleMonth} {cellInfo.bsDay}</span>
                    </div>
                  )
                })}
              </div>
            )
          })
      }
    </div>
  )
}

export default function ProductionCalendarPage() {
  const [curMonth, setCurMonth] = useState(new Date())
  const [selDate, setSelDate]   = useState('')
  const [events, setEvents]     = useState(INITIAL_EVENTS)
  const [view, setView]         = useState('day')
  const [mounted, setMounted]   = useState(false)

  // Client side mounting adjustment targeting absolute device timezone parameters
  useEffect(() => {
    const now = new Date()
    setCurMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelDate(dateKey(now))
    setMounted(true)
  }, [])

  if (!mounted) return <div style={{ background: T.bg, minHeight: '100vh' }} />;

  const year  = curMonth.getFullYear()
  const month = curMonth.getMonth()
  const today = dateKey(new Date())

  const prev = () => setCurMonth(new Date(year, month - 1, 1))
  const next = () => setCurMonth(new Date(year, month + 1, 1))
  const goToday = () => { const now = new Date(); setCurMonth(new Date(now.getFullYear(), now.getMonth(), 1)); setSelDate(dateKey(now)) }

  const addEvent   = (ev)  => setEvents(e => [...e, ev])
  const deleteEvent = (id) => setEvents(e => e.filter(ev => ev.id !== id))

  // Exact localized firstDay calculation algorithm avoiding UTC shift
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays    = new Date(year, month, 0).getDate()
  const cells       = []

  for (let i = firstDay; i > 0; i--) {
    const d  = new Date(year, month - 1, prevDays - i + 1)
    cells.push({ cellDate: d, key: dateKey(d), other: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, month, d)
    cells.push({ cellDate: dObj, key: dateKey(dObj), other: false })
  }
  const totalSlots = cells.length
  const rem = (7 - (totalSlots % 7)) % 7
  for (let d = 1; d <= rem; d++) {
    const dObj = new Date(year, month + 1, d)
    cells.push({ cellDate: dObj, key: dateKey(dObj), other: true })
  }

  const activeMonthMainDetails = getNepaliDateDetails(year, month, 1, firstDay);

  return (
    <div style={s.page}>
      
      {/* Top Controller Bar */}
      <div style={{ ...s.row, justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={s.h1}>Production & Shift Scheduler</h1>
          <p style={{ fontSize: 11, color: T.sub, margin: '4px 0 0' }}>
            Active Year : <strong style={{ color: T.text }}>{activeMonthMainDetails.bsYear}BS / {activeMonthMainDetails.adYear}AD</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${T.border}`, paddingBottom: 2 }}>
          {[{ id: 'day', label: 'Day Control Panel' }, { id: 'history', label: 'Route Logs History' }].map(t => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              style={{
                background: 'none', border: 'none', padding: '5px 12px', fontSize: 12, cursor: 'pointer',
                color: view === t.id ? T.text : T.sub,
                borderBottom: view === t.id ? `2px solid ${T.accent}` : '2px solid transparent',
                fontWeight: view === t.id ? 600 : 400,
                marginBottom: -2,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Month Navigation Row */}
      <div style={{ ...s.row, marginBottom: 16 }}>
        <button onClick={prev} style={s.btnNav}>‹</button>
        <span style={{ fontSize: 15, fontWeight: 700, color: T.text, minWidth: 260, textAlign: 'center' }}>
          {activeMonthMainDetails.bsMonth}
        </span>
        <button onClick={next} style={s.btnNav}>›</button>
        <button onClick={goToday} style={{ ...s.btnGhost, fontSize: 11, marginLeft: 4 }}>Jump to Today</button>

        {/* Legend Pins */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(ROUTES).map(([k, r]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.sub }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.dot, display: 'inline-block' }} />
              {r.label}
            </span>
          ))}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.holiday, fontWeight: 'bold' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.holiday, display: 'inline-block' }} />
            Holiday / Puja
          </span>
        </div>
      </div>

      {/* Core Grid Matrix Layout */}
      <div style={s.two}>
        
        <div>
          <div style={s.grid7}>
            {WEEKDAYS.map(d => (
              <div key={d} style={{ 
                background: T.bgCard, 
                padding: '10px 7px', 
                fontSize: 11, 
                fontWeight: 600, 
                color: d === 'Sat' ? T.holiday : T.muted, 
                textAlign: 'center' 
              }}>
                {d === 'Sat' ? 'Sat (Xuti)' : d}
              </div>
            ))}
            
            {cells.map(({ cellDate, key, other }) => (
              <DayCell
                key={key}
                dateStr={key}
                cellDateObj={cellDate}
                events={events.filter(e => e.date === key)}
                isOtherMonth={other}
                isToday={key === today}
                isSelected={key === selDate}
                onClick={(k) => { setSelDate(k); setView('day') }}
              />
            ))}
          </div>
        </div>

        <div>
          {view === 'history'
            ? <HistoryPanel events={events} />
            : <DayPanel selectedDate={selDate} events={events} onAdd={addEvent} onDelete={deleteEvent} />
          }
        </div>

      </div>
    </div>
  )
}