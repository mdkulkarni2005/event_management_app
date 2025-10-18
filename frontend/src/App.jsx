import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import CreateEventBox from './components/CreateEventBox'
import EventsBox from './components/EventsBox'
import { api } from './api/client'

function App() {
  const [profiles, setProfiles] = useState([])
  const [selectedProfileId, setSelectedProfileId] = useState('')
  const [events, setEvents] = useState([])
  const [viewTz, setViewTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')

  // Load profiles on mount
  useEffect(() => {
    ;(async () => {
      try {
        const list = await api.getProfiles()
        setProfiles(list.map((p) => ({ id: p._id, name: p.name, timezone: p.timezone })))
      } catch (e) {
        console.error('Failed to load profiles', e)
      }
    })()
  }, [])

  // Load events when profile changes
  useEffect(() => {
    if (!selectedProfileId) {
      setEvents([])
      return
    }
    ;(async () => {
      try {
        const list = await api.getEvents(selectedProfileId)
        setEvents(list)
      } catch (e) {
        console.error('Failed to load events', e)
      }
    })()
  }, [selectedProfileId])

  const onCreateProfile = async (name) => {
    try {
      const created = await api.createProfile({ name })
      const p = { id: created._id, name: created.name, timezone: created.timezone }
      setProfiles((prev) => [...prev, p])
      setSelectedProfileId(p.id)
      return p.id
    } catch (e) {
      alert(e.message || 'Failed to create profile')
      return null
    }
  }

  const onSelectProfile = (id) => setSelectedProfileId(id)

  const handleCreateEvent = async (form) => {
    try {
      const created = await api.createEvent({
        profileIds: form.profileIds,
        timezone: form.timezone,
        startUtc: form.startUtc,
        endUtc: form.endUtc,
      })
      setEvents((prev) => [created, ...prev])
      setViewTz(form.timezone)
    } catch (e) {
      alert(e.message || 'Failed to create event')
    }
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
            profiles={profiles}
            onUpdateEvent={async (id, patch) => {
              try {
                const updated = await api.updateEvent(id, patch)
                setEvents((prev) => prev.map((e) => {
                  if (e._id !== id) return e
                  const changes = []
                  const fields = ['startUtc', 'endUtc', 'timezone', 'profileIds']
                  fields.forEach((f) => {
                    if (patch[f] === undefined) return
                    const before = e[f]
                    const after = patch[f]
                    if (Array.isArray(before) && Array.isArray(after)) {
                      const a = [...before].sort().join(',')
                      const b = [...after].sort().join(',')
                      if (a !== b) changes.push({ field: f, from: before, to: after })
                    } else if (before !== after) {
                      changes.push({ field: f, from: before, to: after })
                    }
                  })
                  const logEntry = changes.length ? { at: new Date().toISOString(), changes } : null
                  return {
                    ...updated,
                    logs: logEntry ? [logEntry, ...(e.logs || [])] : (e.logs || []),
                  }
                }))
              } catch (e) {
                alert(e.message || 'Failed to update event')
              }
            }}
            onDeleteEvent={async (id) => {
              try {
                await api.deleteEvent(id)
                setEvents((prev) => prev.filter((e) => e._id !== id))
              } catch (e) {
                alert(e.message || 'Failed to delete event')
              }
            }}
          />
        </div>
      </main>
    </div>
  )
}

export default App
