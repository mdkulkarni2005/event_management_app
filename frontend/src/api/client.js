const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    let message = `HTTP ${res.status}`
    try {
      const data = await res.json()
      message = data?.error || message
    } catch {
      // ignore parse error
    }
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const api = {
  health: () => request('/api/health'),
  
  getProfiles: () => request('/api/profiles'),
  createProfile: (body) => request('/api/profiles', { method: 'POST', body: JSON.stringify(body) }),
  
  getEvents: (profileId) => request(`/api/events${profileId ? `?profileId=${encodeURIComponent(profileId)}` : ''}`),
  createEvent: (body) => request('/api/events', { method: 'POST', body: JSON.stringify(body) }),
  updateEvent: (id, body) => request(`/api/events/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),
}

export default api
