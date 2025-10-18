import React, { useMemo, useState } from 'react'
import { formatInTz, fromLocalParts, toUTCISO, isEndAfterStart } from '../utils/date'

const EventsBox = ({
  events,
  selectedProfileId,
  timezone,
  onUpdateEvent,
}) => {
  const [editingId, setEditingId] = useState(null)
  const [drafts, setDrafts] = useState({})

  const myEvents = useMemo(() => {
    if (!selectedProfileId) return []
    return events.filter((e) => e.profileIds.includes(selectedProfileId))
  }, [events, selectedProfileId])

  const startEdit = (evt) => {
    setEditingId(evt.id)
    const startLocal = formatInTz(evt.startUtc, timezone, 'YYYY-MM-DD HH:mm').split(' ')
    const endLocal = formatInTz(evt.endUtc, timezone, 'YYYY-MM-DD HH:mm').split(' ')
    setDrafts({
      startDate: startLocal[0],
      startTime: startLocal[1],
      endDate: endLocal[0],
      endTime: endLocal[1],
    })
  }

  const saveEdit = (evt) => {
    const d = drafts
    if (!d.startDate || !d.startTime || !d.endDate || !d.endTime) {
      alert('Fill all date/time fields')
      return
    }
    if (!isEndAfterStart(d.startDate, d.startTime, d.endDate, d.endTime, timezone)) {
      alert('End must be >= start in selected timezone')
      return
    }
    const startZ = fromLocalParts(d.startDate, d.startTime, timezone)
    const endZ = fromLocalParts(d.endDate, d.endTime, timezone)
    onUpdateEvent(evt.id, {
      startUtc: toUTCISO(startZ),
      endUtc: toUTCISO(endZ),
    })
    setEditingId(null)
  }

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
                <div className="event-edit">
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
                    <button onClick={() => saveEdit(evt)}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                  </div>
                </div>
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
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default EventsBox
