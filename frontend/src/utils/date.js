import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// Combine separate date and time strings into a Dayjs in given timezone
export function fromLocalParts(dateStr, timeStr, tz) {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  const isoLocal = `${dateStr}T${timeStr}:00`
  // interpret as time in tz
  const z = dayjs.tz(isoLocal, tz)
  return z
}

// Convert dayjs or ISO to ISO string in UTC
export function toUTCISO(d) {
  return dayjs(d).utc().toISOString()
}

// Display UTC ISO for a timezone
export function formatInTz(utcISO, tz, fmt = 'YYYY-MM-DD HH:mm') {
  return dayjs.utc(utcISO).tz(tz).format(fmt)
}

// Compare two local parts given tz; returns true if end >= start
export function isEndAfterStart(startDate, startTime, endDate, endTime, tz) {
  const s = fromLocalParts(startDate, startTime, tz)
  const e = fromLocalParts(endDate, endTime, tz)
  return e.isSame(s) || e.isAfter(s)
}

// Get current UTC offset string for a timezone, like 'UTC+05:30'
export function offsetForTz(tz) {
  const off = dayjs().tz(tz).format('Z') // e.g. +05:30
  return `UTC${off}`
}
