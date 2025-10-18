import React, { useMemo, useState } from 'react'
import { formatInTz, fromLocalParts, toUTCISO, isEndAfterStart } from '../utils/date'
import TimezoneSelect from './TimezoneSelect'
import Modal from './Modal'
import ProfileSelect from './ProfileSelect'

const EventsBox = ({
  events,
  selectedProfileId,
  timezone,
  profiles = [],
  onUpdateEvent,
  onDeleteEvent,
  onChangeViewTimezone,
}) => {
  const [editingId, setEditingId] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [confirmId, setConfirmId] = useState(null)
  const [editProfiles, setEditProfiles] = useState([])
  const [editTz, setEditTz] = useState(timezone)

  const myEvents = useMemo(() => {
    if (!selectedProfileId) return []
    return events.filter((e) => e.profileIds.includes(selectedProfileId))
  }, [events, selectedProfileId])

  const startEdit = (evt) => {
    setEditingId(evt.id)
    // Use event's timezone if available for editing context
    const tz = evt.timezone || timezone
    setEditTz(tz)
    setEditProfiles(evt.profileIds || [])
    const startLocal = formatInTz(evt.startUtc, tz, 'YYYY-MM-DD HH:mm').split(' ')
    const endLocal = formatInTz(evt.endUtc, tz, 'YYYY-MM-DD HH:mm').split(' ')
    setDrafts({
      startDate: startLocal[0],
      startTime: startLocal[1],
      endDate: endLocal[0],
      endTime: endLocal[1],
    })
  }

  const saveEdit = () => {
    const d = drafts
    if (!d.startDate || !d.startTime || !d.endDate || !d.endTime) {
      alert('Fill all date/time fields')
      return
    }
    if (!isEndAfterStart(d.startDate, d.startTime, d.endDate, d.endTime, editTz)) {
      alert('End must be >= start in selected timezone')
      return
    }
    const startZ = fromLocalParts(d.startDate, d.startTime, editTz)
    const endZ = fromLocalParts(d.endDate, d.endTime, editTz)
    onUpdateEvent(editingId, {
      startUtc: toUTCISO(startZ),
      endUtc: toUTCISO(endZ),
      timezone: editTz,
      profileIds: editProfiles,
    })
    setEditingId(null)
  }

  return (
    <section className="box">
      <h2 className="box-title">Events</h2>
      <div className="form-row" style={{ marginBottom: 8 }}>
        <label>View in Timezone</label>
        <TimezoneSelect id="view-tz" value={timezone} onChange={(e) => onChangeViewTimezone?.(e.target.value)} />
      </div>
      {!selectedProfileId ? (
        <p>Select a profile to see events.</p>
      ) : myEvents.length === 0 ? (
        <p>No events for this profile yet.</p>
      ) : (
        <ul className="event-list">
          {myEvents.map((evt) => (
            <li key={evt.id} className="event-item">
              <div className="event-view">
                <div className="event-meta" style={{ marginBottom: 4 }}>
                  <span>
                    {evt.profileIds
                      .map((id) => profiles.find((p) => p.id === id)?.name || '—')
                      .join(', ')}
                  </span>
                </div>
                <div className="event-line">
                  <strong>Start:</strong> {formatInTz(evt.startUtc, timezone)}
                </div>
                <div className="event-line">
                  <strong>End:</strong> {formatInTz(evt.endUtc, timezone)}
                </div>
                <div className="event-meta">
                  <div>Created: {formatInTz(evt.createdAt, timezone, 'MMM DD, YYYY [at] hh:mm A')}</div>
                  <div>Updated: {formatInTz(evt.updatedAt, timezone, 'MMM DD, YYYY [at] hh:mm A')}</div>
                </div>
                <div className="form-actions">
                  <button onClick={() => startEdit(evt)}>Edit</button>
                  <button style={{ marginLeft: 8, background: '#f3f4f6', color: '#374151' }} onClick={() => alert('Logs coming soon')}>View Logs</button>
                  <button onClick={() => setConfirmId(evt.id)} style={{ marginLeft: 8, background: '#ef4444' }}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!editingId} title="Edit Event" onClose={() => setEditingId(null)}>
        <div className="form-grid">
          <div className="form-row two-col">
            <div>
              <label>Start date</label>
              <input
                type="date"
                value={drafts.startDate || ''}
                onChange={(e) => setDrafts({ ...drafts, startDate: e.target.value })}
              />
            </div>
            <div>
              <label>Start time</label>
              <input
                type="time"
                value={drafts.startTime || ''}
                onChange={(e) => setDrafts({ ...drafts, startTime: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row two-col">
            <div>
              <label>End date</label>
              <input
                type="date"
                value={drafts.endDate || ''}
                onChange={(e) => setDrafts({ ...drafts, endDate: e.target.value })}
              />
            </div>
            <div>
              <label>End time</label>
              <input
                type="time"
                value={drafts.endTime || ''}
                onChange={(e) => setDrafts({ ...drafts, endTime: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={saveEdit}>Update Event</button>
            <button style={{ marginLeft: 8 }} onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!confirmId} title="Delete Event" onClose={() => setConfirmId(null)}>
        <p>Are you sure you want to delete this event?</p>
        <div className="form-actions">
          <button style={{ background: '#ef4444' }} onClick={() => { onDeleteEvent(confirmId); setConfirmId(null) }}>Delete</button>
          <button style={{ marginLeft: 8 }} onClick={() => setConfirmId(null)}>Cancel</button>
        </div>
      </Modal>
    </section>
  )
}

export default EventsBox
