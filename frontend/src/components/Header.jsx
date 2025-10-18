import React from 'react'
import ProfileSelect from './ProfileSelect'

const Header = ({ appName, subtitle, profiles, selectedProfileId, onSelectProfile, onCreateProfile }) => {
  const handleProfileChange = (e) => {
    onSelectProfile(e)
  }

  return (
    <header className="app-header">
      <div className="app-header__top">
        <h1 className="app-title">{appName}</h1>
        <div className="profile-select" style={{ minWidth: 260 }}>
          <label htmlFor="currentProfile" className="sr-only">Current Profile</label>
          <ProfileSelect
            id="currentProfile"
            profiles={profiles}
            multiple={false}
            selectedId={selectedProfileId || ''}
            onChange={handleProfileChange}
            onCreateProfile={onCreateProfile}
            searchPlaceholder="Search current profile..."
          />
        </div>
      </div>
      {subtitle && <p className="app-subtitle">{subtitle}</p>}
    </header>
  )
}

export default Header
