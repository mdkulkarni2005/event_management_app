import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import CreateEventBox from './components/CreateEventBox'
import EventsBox from './components/EventsBox'

function App() {
  const [profiles, setProfiles] = useState([])
  const [selectedProfileId, setSelectedProfileId] = useState('')
  const [events, setEvents] = useState([])
  const [viewTz, setViewTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')

  // helper to create a simple id
  const genId = () => Math.random().toString(36).slice(2, 10)

  const onCreateProfile = (name) => {
    const newProfile = { id: genId(), name }
    setProfiles((prev) => [...prev, newProfile])
    setSelectedProfileId(newProfile.id)
    return newProfile.id
  }

  const onSelectProfile = (id) => setSelectedProfileId(id)

  const handleCreateEvent = (form) => {
    // form: { profileIds, timezone, startUtc, endUtc }
    const newEvt = {
      id: genId(),
      profileIds: form.profileIds,
      timezone: form.timezone, // creator's selection
      startUtc: form.startUtc,
      endUtc: form.endUtc,
      createdAt: form.startUtc, // storing creator's perceived start as createdAt is ambiguous; backend will compute
      updatedAt: form.startUtc,
    }
    setEvents((prev) => [newEvt, ...prev])
    setViewTz(form.timezone)
  }

  const appName = 'Event Management System'
  const subtitle = 'Manage events across profiles and timezones.'

  return (
    <div className="app-root">
      <Header
        appName={appName}
        subtitle={subtitle}
        profiles={profiles}
        selectedProfileId={selectedProfileId}
        onSelectProfile={onSelectProfile}
        onCreateProfile={onCreateProfile}
      />

      <main className="content">
        <div className="grid two">
          <CreateEventBox
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onCreateProfile={onCreateProfile}
            onSelectProfile={onSelectProfile}
            onSubmit={handleCreateEvent}
          />
          <EventsBox
            events={events}
            selectedProfileId={selectedProfileId}
            timezone={viewTz}
            onUpdateEvent={(id, patch) =>
              setEvents((prev) =>
                prev.map((e) => (e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e))
              )
            }
          />
        </div>
      </main>
    </div>
  )
}

export default App
