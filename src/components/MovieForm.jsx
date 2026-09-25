import { useState } from 'react'

const GENRES = ['Action', 'Animation', 'Comedy', 'Documentary', 'Drama', 'Horror',
  'Romance', 'Sci-Fi', 'Thriller', 'Other']

export default function MovieForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [year, setYear] = useState(initial?.release_year ?? '')
  const [genre, setGenre] = useState(initial?.genre ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'to_watch')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const watched = status === 'watched'
    await onSave({
      title: title.trim(),
      release_year: year === '' ? null : Number(year),
      genre: genre || null,
      status,
      notes: notes.trim() || null,
      watched_at: watched ? (initial?.watched_at ?? new Date().toISOString()) : null,
      rating: watched ? (initial?.rating ?? null) : null,
    })
    setSaving(false)
  }

  return (
    <form className="panel movie-form" onSubmit={handleSubmit}>
      <h2 className="panel-title">{initial ? 'Edit movie' : 'Add a movie'}</h2>

      <label className="field field-wide">
        <span>Title</span>
        <input required maxLength={200} value={title} autoFocus
          onChange={(e) => setTitle(e.target.value)} />
      </label>

      <label className="field">
        <span>Release year</span>
        <input type="number" min="1888" max="2100" inputMode="numeric" value={year}
          onChange={(e) => setYear(e.target.value)} />
      </label>

      <label className="field">
        <span>Genre</span>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Pick one</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </label>

      <label className="field">
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="to_watch">Want to watch</option>
          <option value="watched">Watched</option>
        </select>
      </label>

      <label className="field field-wide">
        <span>Notes</span>
        <textarea rows="3" value={notes} placeholder="Who recommended it, where it's streaming…"
          onChange={(e) => setNotes(e.target.value)} />
      </label>

      <div className="form-actions field-wide">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Add to watchlist'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
