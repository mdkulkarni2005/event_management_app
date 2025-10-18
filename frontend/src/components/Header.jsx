import React from 'react'
import Modal from './Modal'
import ProfileSelect from './ProfileSelect'

const Header = ({ appName, subtitle, profiles, selectedProfileId, onSelectProfile, onCreateProfile }) => {
  const [showModal, setShowModal] = React.useState(false)
  const [profileName, setProfileName] = React.useState('')
  // selection handled by ProfileSelect

  return (
    <header className="app-header">
      <div className="app-header__top">
        <h1 className="app-title">{appName}</h1>
        <div className="profile-select" style={{ minWidth: 240 }}>
          <label htmlFor="currentProfile" className="sr-only">Current Profile</label>
          <ProfileSelect
            id="currentProfile"
            profiles={profiles}
            multiple={false}
            selectedId={selectedProfileId || ''}
            onChange={(id) => id === '__create__' ? setShowModal(true) : onSelectProfile(id)}
            onRequestAdd={() => setShowModal(true)}
          />
        </div>
      </div>
      {subtitle && <p className="app-subtitle">{subtitle}</p>}

      <Modal
        open={showModal}
        title="Create new profile"
        onClose={() => setShowModal(false)}
      >
        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="profile-name">Profile name</label>
            <input
              id="profile-name"
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="e.g., Marketing Team"
            />
          </div>
          <div className="form-actions">
            <button
              onClick={() => {
                const name = profileName.trim()
                if (!name) return
                const id = onCreateProfile(name)
                if (id) onSelectProfile(id)
                setShowModal(false)
              }}
            >
              Create
            </button>
            <button style={{ marginLeft: 8 }} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </header>
  )
}

export default Header
