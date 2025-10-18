import React from 'react'

const Header = ({ appName, subtitle, profiles, selectedProfileId, onSelectProfile, onCreateProfile }) => {
  const handleProfileChange = (e) => {
    const value = e.target.value
    if (value === '__create__') {
      const name = window.prompt('Enter new profile name:')
      if (name && name.trim()) {
        const newId = onCreateProfile(name.trim())
        if (newId) onSelectProfile(newId)
      } else {
        // revert to previous selection if canceled
        e.target.value = selectedProfileId || ''
      }
      return
    }
    onSelectProfile(value)
  }

  return (
    <header className="app-header">
      <div className="app-header__top">
        <h1 className="app-title">{appName}</h1>
        <div className="profile-select">
          <label htmlFor="currentProfile" className="sr-only">Current Profile</label>
          <select id="currentProfile" value={selectedProfileId || ''} onChange={handleProfileChange}>
            {profiles.length === 0 && <option value="" disabled>No profiles</option>}
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value="__create__">+ Create new profile…</option>
          </select>
        </div>
      </div>
      {subtitle && <p className="app-subtitle">{subtitle}</p>}
    </header>
  )
}

export default Header
