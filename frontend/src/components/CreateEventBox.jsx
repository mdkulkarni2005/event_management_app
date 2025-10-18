import React, { useState } from 'react'
import { fromLocalParts, toUTCISO, isEndAfterStart } from '../utils/date'
import TimezoneSelect from './TimezoneSelect'
import ProfileSelect from './ProfileSelect'

const CreateEventBox = ({
  profiles,
  selectedProfileId,
  onCreateProfile,
  onSelectProfile,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    profileIds: selectedProfileId ? [selectedProfileId] : [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  })

  // keep profile in sync if parent selection changes
  React.useEffect(() => {
    setForm((f) => ({
      ...f,
      profileIds: selectedProfileId ? [selectedProfileId] : f.profileIds,
    }))
  }, [selectedProfileId])

  // timezone options handled by TimezoneSelect

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleProfileChange = (ids) => setForm({ ...form, profileIds: ids })

  const submit = (e) => {
    e.preventDefault()
    if (!form.profileIds || form.profileIds.length === 0) {
      alert('Please select at least one profile')
      return
    }
    if (!form.startDate || !form.startTime || !form.endDate || !form.endTime) {
      alert('Please fill start and end date/time')
      return
    }
    if (!isEndAfterStart(form.startDate, form.startTime, form.endDate, form.endTime, form.timezone)) {
      alert('End date/time must be after or equal to start date/time (in selected timezone)')
      return
    }

    const startZ = fromLocalParts(form.startDate, form.startTime, form.timezone)
    const endZ = fromLocalParts(form.endDate, form.endTime, form.timezone)

    const payload = {
      profileIds: form.profileIds,
      timezone: form.timezone,
      startUtc: toUTCISO(startZ),
      endUtc: toUTCISO(endZ),
    }

    onSubmit?.(payload)
  }

  return (
    <section className="box">
      <h2 className="box-title">Create Event</h2>
      <form onSubmit={submit} className="form-grid">
        <div className="form-row">
          <label htmlFor="ce-profiles">Profiles</label>
          <ProfileSelect
            id="ce-profiles"
            profiles={profiles}
            multiple={true}
            selectedIds={form.profileIds}
            onChange={handleProfileChange}
            onCreateProfile={(name) => {
              const id = onCreateProfile(name)
              if (id) {
                setForm((f) => ({ ...f, profileIds: Array.from(new Set([...(f.profileIds || []), id])) }))
                onSelectProfile(id)
              }
              return id
            }}
          />
        </div>

        <div className="form-row">
          <label htmlFor="ce-timezone">Timezone</label>
          <TimezoneSelect id="ce-timezone" value={form.timezone} onChange={update('timezone')} />
        </div>

        <div className="form-row two-col">
          <div>
            <label htmlFor="ce-start-date">Start date</label>
            <input id="ce-start-date" type="date" value={form.startDate} onChange={update('startDate')} />
          </div>
          <div>
            <label htmlFor="ce-start-time">Start time</label>
            <input id="ce-start-time" type="time" value={form.startTime} onChange={update('startTime')} />
          </div>
        </div>

        <div className="form-row two-col">
          <div>
            <label htmlFor="ce-end-date">End date</label>
            <input id="ce-end-date" type="date" value={form.endDate} onChange={update('endDate')} />
          </div>
          <div>
            <label htmlFor="ce-end-time">End time</label>
            <input id="ce-end-time" type="time" value={form.endTime} onChange={update('endTime')} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Create Event</button>
        </div>
      </form>
      {/* Inline modal removed; creation now handled inline in ProfileSelect */}
    </section>
  )
}

export default CreateEventBox
