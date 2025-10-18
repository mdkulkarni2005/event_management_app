import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { offsetForTz } from '../utils/date'

dayjs.extend(utc)
dayjs.extend(timezone)

const TimezoneSelect = ({ id, value, onChange, placeholder = 'Search timezone…' }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  // Curated list only, per requirements
  const ZONES = useMemo(() => [
    // North America (US)
    { label: 'Eastern Time (ET)', tz: 'America/New_York' },
    { label: 'Central Time (CT)', tz: 'America/Chicago' },
    { label: 'Mountain Time (MT)', tz: 'America/Denver' },
    { label: 'Pacific Time (PT)', tz: 'America/Los_Angeles' },
    { label: 'Alaska Time (AKT)', tz: 'America/Anchorage' },
    { label: 'Hawaii Time (HT)', tz: 'Pacific/Honolulu' },
    // Canada/Atlantic region
    { label: 'Atlantic Time (AT)', tz: 'America/Halifax' },
    { label: 'Newfoundland Time (NT)', tz: 'America/St_Johns' },
    // Mexico variants
    { label: 'Mexican Pacific Time (MPT)', tz: 'America/Tijuana' },
    { label: 'Mexican Central Time (MCT)', tz: 'America/Mexico_City' },
    { label: 'Mexican Eastern Time (MET)', tz: 'America/Cancun' },
    // South America
    { label: 'Brasília Time (BRT)', tz: 'America/Sao_Paulo' },
    { label: 'Amazon Time (AMT)', tz: 'America/Manaus' },
    { label: 'Argentina Time (ART)', tz: 'America/Argentina/Buenos_Aires' },
    { label: 'Chile Time (CLT)', tz: 'America/Santiago' },
    { label: 'Peru Time (PET)', tz: 'America/Lima' },
    // Europe
    { label: 'London (GMT/BST)', tz: 'Europe/London' },
    { label: 'Paris (CET/CEST)', tz: 'Europe/Paris' },
    { label: 'Berlin (CET/CEST)', tz: 'Europe/Berlin' },
    { label: 'Madrid (CET/CEST)', tz: 'Europe/Madrid' },
    { label: 'Rome (CET/CEST)', tz: 'Europe/Rome' },
    { label: 'Moscow (MSK)', tz: 'Europe/Moscow' },
    { label: 'Istanbul (TRT)', tz: 'Europe/Istanbul' },
    // Asia
    { label: 'India Standard Time (IST)', tz: 'Asia/Kolkata' },
    { label: 'China Standard Time (CST)', tz: 'Asia/Shanghai' },
    { label: 'Japan Standard Time (JST)', tz: 'Asia/Tokyo' },
    { label: 'Korea Standard Time (KST)', tz: 'Asia/Seoul' },
    { label: 'Singapore Time (SGT)', tz: 'Asia/Singapore' },
    { label: 'Hong Kong Time (HKT)', tz: 'Asia/Hong_Kong' },
    { label: 'Thailand Time (THA)', tz: 'Asia/Bangkok' },
    { label: 'Indonesia Western Time (WIB)', tz: 'Asia/Jakarta' },
    { label: 'Indonesia Central Time (WITA)', tz: 'Asia/Makassar' },
    { label: 'Indonesia Eastern Time (WIT)', tz: 'Asia/Jayapura' },
    // Australia/NZ
    { label: 'Australian Western Time (AWST)', tz: 'Australia/Perth' },
    { label: 'Australian Central Time (ACST)', tz: 'Australia/Adelaide' },
    { label: 'Australian Eastern Time (AEST/AEDT)', tz: 'Australia/Sydney' },
    { label: 'New Zealand Time (NZST/NZDT)', tz: 'Pacific/Auckland' },
    // Africa
    { label: 'South Africa Standard Time (SAST)', tz: 'Africa/Johannesburg' },
    { label: 'East Africa Time (EAT)', tz: 'Africa/Nairobi' },
    { label: 'West Africa Time (WAT)', tz: 'Africa/Lagos' },
    { label: 'Central Africa Time (CAT)', tz: 'Africa/Harare' },
    // Middle East
    { label: 'Gulf Standard Time (GST)', tz: 'Asia/Dubai' },
    { label: 'Iran Standard Time (IRST/IRDT)', tz: 'Asia/Tehran' },
    { label: 'Israel Standard Time (IST/IDT)', tz: 'Asia/Jerusalem' },
    { label: 'Arabia Standard Time (AST)', tz: 'Asia/Riyadh' },
  ], [])

  const options = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ZONES
    return ZONES.filter(
      (z) => z.label.toLowerCase().includes(q) || z.tz.toLowerCase().includes(q)
    )
  }, [query, ZONES])

  const friendly = (tz) => {
    const hit = ZONES.find((c) => c.tz === tz)
    const off = offsetForTz(tz)
    if (hit) return `${hit.label} (${off})`
    const city = tz.split('/').slice(-1)[0].replace('_', ' ')
    return `${city} (${off})`
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const select = (tz) => {
    onChange({ target: { value: tz } })
    setOpen(false)
    setQuery('')
  }

  const currentLabel = value || '\u2014 Select timezone \u2014'

  return (
    <div className="tzsel" ref={containerRef}>
      <button
        type="button"
        id={id}
        className="tzsel-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="tzsel-label">{currentLabel}</span>
        <span className="tzsel-caret">▾</span>
      </button>
      {open && (
        <div className="tzsel-popover" role="listbox">
          <input
            type="text"
            className="tzsel-search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <ul className="tzsel-list">
            {options.length === 0 ? (
              <li className="tzsel-empty">No matches</li>
            ) : (
              options.map((z) => (
                <li
                  key={z.tz}
                  className={z.tz === value ? 'tzsel-option selected' : 'tzsel-option'}
                  onClick={() => select(z.tz)}
                  role="option"
                  aria-selected={z.tz === value}
                  title={z.label}
                >
                  {friendly(z.tz)}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TimezoneSelect
