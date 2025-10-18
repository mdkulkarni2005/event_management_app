import React, { useEffect, useMemo, useRef, useState } from 'react'

const ProfileSelect = ({
  id,
  profiles,
  multiple = false,
  selectedIds = [], // for multiple
  selectedId = '', // for single
  onChange, // (ids[]) for multiple or (id) for single
  placeholder = multiple ? 'Select profiles...' : 'Select profile...',
  onRequestAdd, // optional callback to open Add Profile modal
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return profiles
    return profiles.filter((p) => p.name.toLowerCase().includes(q))
  }, [profiles, query])

  const isSelected = (id) => {
    return multiple ? selectedIds.includes(id) : selectedId === id
  }

  const toggle = (id) => {
    if (multiple) {
      const next = isSelected(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
      onChange?.(next)
    } else {
      onChange?.(id)
      setOpen(false)
    }
  }

  const summary = () => {
    if (multiple) {
      if (!selectedIds || selectedIds.length === 0) return placeholder
      return `${selectedIds.length} profile${selectedIds.length > 1 ? 's' : ''} selected`
    } else {
      const p = profiles.find((x) => x.id === selectedId)
      return p ? p.name : placeholder
    }
  }

  return (
    <div className="psel" ref={containerRef}>
      <button
        type="button"
        id={id}
        className="psel-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="psel-label">{summary()}</span>
        <span className="psel-caret">▾</span>
      </button>
      {open && (
        <div className="psel-popover" role="listbox">
          <input
            type="text"
            className="psel-search"
            placeholder={multiple ? 'Search profiles...' : 'Search profile...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <ul className="psel-list">
            {filtered.length === 0 ? (
              <li className="psel-empty">No profiles</li>
            ) : (
              filtered.map((p) => (
                <li
                  key={p.id}
                  className={isSelected(p.id) ? 'psel-option selected' : 'psel-option'}
                  onClick={() => toggle(p.id)}
                  role="option"
                  aria-selected={isSelected(p.id)}
                  title={p.name}
                >
                  {p.name}
                </li>
              ))
            )}
            {onRequestAdd && (
              <li className="psel-add" onClick={() => onRequestAdd()}>
                + Add Profile
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProfileSelect
