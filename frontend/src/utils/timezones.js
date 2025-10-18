// Provides a list of IANA timezones for dropdowns.
// Uses Intl.supportedValuesOf when available; falls back to a minimal curated list.

let tz = []
try {
  // Some browsers/environments support this
  if (typeof Intl.supportedValuesOf === 'function') {
    tz = Intl.supportedValuesOf('timeZone')
  }
} catch {
  // ignore
}

export const timezones = tz.length
  ? tz
  : [
      'UTC',
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'Europe/London',
      'Europe/Berlin',
      'Europe/Paris',
      'Asia/Kolkata',
      'Asia/Tokyo',
      'Asia/Singapore',
      'Australia/Sydney',
    ]
