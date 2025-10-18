import React, { useMemo, useState } from 'react'
import { formatInTz, fromLocalParts, toUTCISO, isEndAfterStart } from '../utils/date'
import Modal from './Modal'
import TimezoneSelect from './TimezoneSelect'
import ProfileSelect from './ProfileSelect'

const EventsBox = ({
  events,
  selectedProfileId,
  timezone,
  onUpdateEvent,
  onDeleteEvent,
  profiles = [],
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

  const saveEdit = (evt) => {
    const d = drafts
    if (!d.startDate || !d.startTime || !d.endDate || !d.endTime) return
    if (!isEndAfterStart(d.startDate, d.startTime, d.endDate, d.endTime, editTz)) return
    const startZ = fromLocalParts(d.startDate, d.startTime, editTz)
    const endZ = fromLocalParts(d.endDate, d.endTime, editTz)
    onUpdateEvent(evt.id, {
      startUtc: toUTCISO(startZ),
      endUtc: toUTCISO(endZ),
      timezone: editTz,
      profileIds: editProfiles,
    })
    setEditingId(null)
  }

  const [openLogsId, setOpenLogsId] = useState(null)

  return (
    <section className="box">
      <h2 className="box-title">Events</h2>
      {!selectedProfileId ? (
        <p>Select a profile to see events.</p>
      ) : myEvents.length === 0 ? (
        <p>No events for this profile yet.</p>
      ) : (
        <ul className="event-list">
          {myEvents.map((evt) => (
            <li key={evt.id} className="event-item">
              {editingId === evt.id ? (
                <Modal open={true} title="Edit Event" onClose={() => setEditingId(null)}>
                  <div className="form-grid">
                    <div className="form-row">
                      <label>Profiles</label>
                      <ProfileSelect
                        profiles={profiles}
                        multiple={true}
                        selectedIds={editProfiles}
                        onChange={setEditProfiles}
                      />
                    </div>
                    <div className="form-row">
                      <label>Timezone</label>
                      <TimezoneSelect id="edit-tz" value={editTz} onChange={(e) => setEditTz(e.target.value)} />
                    </div>
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
                      <button onClick={() => saveEdit(evt)}>Update Event</button>
                      <button onClick={() => setEditingId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                    </div>
                  </div>
                </Modal>
              ) : (
                <div className="event-view">
                  <div className="event-line">
                    <strong>Start:</strong> {formatInTz(evt.startUtc, timezone)}
                  </div>
                  <div className="event-line">
                    <strong>End:</strong> {formatInTz(evt.endUtc, timezone)}
                  </div>
                  <div className="event-meta">
                    <span>Profiles: {evt.profileIds.length}</span>
                  </div>
                  <div className="form-actions">
                    <button onClick={() => startEdit(evt)}>Edit</button>
                    <button style={{ marginLeft: 8, background: '#f3f4f6', color: '#374151' }} onClick={() => setOpenLogsId(openLogsId === evt.id ? null : evt.id)}>View Logs</button>
                    <button style={{ marginLeft: 8, background: '#ef4444' }} onClick={() => setConfirmId(evt.id)}>Delete</button>
                  </div>
                  {openLogsId === evt.id && (evt.logs && evt.logs.length > 0) && (
                    <div className="event-logs" style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {evt.logs.map((log, idx) => (
                          <li key={idx} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 8 }}>
                            <div className="event-log-time" style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>
                              Updated: {formatInTz(log.at, timezone, 'MMM DD, YYYY [at] hh:mm A')}
                            </div>
                            <div className="event-log-changes" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {log.changes.map((c, ci) => (
                                <div key={ci}>
                                  <strong style={{ textTransform: 'capitalize' }}>{c.field}:</strong>{' '}
                                  <span style={{ color: '#6b7280' }}>from</span>{' '}
                                  {renderValue(c.field, c.from, timezone, profiles)}{' '}
                                  <span style={{ color: '#6b7280' }}>to</span>{' '}
                                  {renderValue(c.field, c.to, timezone, profiles)}
                                </div>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!confirmId} title="Delete Event" onClose={() => setConfirmId(null)}>
        <p>Are you sure you want to delete this event?</p>
        <div className="form-actions">
          <button style={{ background: '#ef4444' }} onClick={() => { onDeleteEvent?.(confirmId); setConfirmId(null) }}>Delete</button>
          <button style={{ marginLeft: 8 }} onClick={() => setConfirmId(null)}>Cancel</button>
        </div>
      </Modal>
    </section>
  )
}

export default EventsBox

function renderValue(field, value, tz, profiles) {
  if (field === 'startUtc' || field === 'endUtc') {
    return <em>{formatInTz(value, tz)}</em>
  }
  if (field === 'timezone') {
    return <code>{value}</code>
  }
  if (field === 'profileIds' && Array.isArray(value)) {
    const names = value.map((id) => profiles.find((p) => p.id === id)?.name || '—')
    return <span>{names.join(', ')}</span>
  }
  return <span>{String(value)}</span>
}
