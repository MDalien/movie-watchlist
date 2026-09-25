import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import MovieForm from './MovieForm'
import TicketCard from './TicketCard'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'to_watch', label: 'To watch' },
  { id: 'watched', label: 'Watched' },
]

export default function Watchlist({ session }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // movie being edited, or null when adding

  // READ: load this user's movies (RLS makes sure we only get our own rows)
  useEffect(() => {
    async function loadMovies() {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setMovies(data)
      setLoading(false)
    }
    loadMovies()
  }, [])

  // CREATE or UPDATE
  async function saveMovie(values) {
    setError('')
    if (editing) {
      const { data, error } = await supabase
        .from('movies').update(values).eq('id', editing.id).select().single()
      if (error) return setError(error.message)
      setMovies((list) => list.map((m) => (m.id === data.id ? data : m)))
    } else {
      const { data, error } = await supabase.from('movies').insert(values).select().single()
      if (error) return setError(error.message)
      setMovies((list) => [data, ...list])
    }
    closeForm()
  }

  // DELETE
  async function deleteMovie(movie) {
    if (!window.confirm(`Remove "${movie.title}" from your watchlist?`)) return
    const { error } = await supabase.from('movies').delete().eq('id', movie.id)
    if (error) return setError(error.message)
    setMovies((list) => list.filter((m) => m.id !== movie.id))
  }

  // UPDATE a few fields without opening the form (status toggle, star rating)
  async function patchMovie(movie, changes) {
    const { data, error } = await supabase
      .from('movies').update(changes).eq('id', movie.id).select().single()
    if (error) return setError(error.message)
    setMovies((list) => list.map((m) => (m.id === data.id ? data : m)))
  }

  function toggleWatched(movie) {
    const watched = movie.status !== 'watched'
    patchMovie(movie, {
      status: watched ? 'watched' : 'to_watch',
      watched_at: watched ? new Date().toISOString() : null,
      rating: watched ? movie.rating : null,
    })
  }

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(movie) {
    setEditing(movie)
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeForm() {
    setEditing(null)
    setFormOpen(false)
  }

  const counts = useMemo(() => ({
    all: movies.length,
    to_watch: movies.filter((m) => m.status === 'to_watch').length,
    watched: movies.filter((m) => m.status === 'watched').length,
  }), [movies])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return movies.filter((m) => {
      if (filter !== 'all' && m.status !== filter) return false
      if (!q) return true
      return m.title.toLowerCase().includes(q) || (m.genre || '').toLowerCase().includes(q)
    })
  }, [movies, filter, search])

  return (
    <div className="page">
      <header className="topbar">
        <span className="brand">Movie Watchlist</span>
        <div className="account">
          <span className="muted account-email">{session.user.email}</span>
          <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
      </header>

      <main className="content">
        <section className="summary">
          <h1 className="headline">
            {counts.to_watch === 1 ? '1 movie' : `${counts.to_watch} movies`} to watch
          </h1>
          <p className="muted">
            {counts.watched === 0 ? 'Nothing marked as watched yet.' : `${counts.watched} already seen.`}
          </p>
        </section>

        {formOpen ? (
          <MovieForm key={editing?.id ?? 'new'} initial={editing} onSave={saveMovie} onCancel={closeForm} />
        ) : (
          <button className="btn btn-primary" onClick={openAdd}>Add a movie</button>
        )}

        {error && <p className="message message-error" role="alert">{error}</p>}

        <div className="toolbar">
          <div className="tabs" role="tablist" aria-label="Filter movies">
            {FILTERS.map((f) => (
              <button key={f.id} role="tab" aria-selected={filter === f.id}
                className={`tab ${filter === f.id ? 'tab-active' : ''}`}
                onClick={() => setFilter(f.id)}>
                {f.label} <span className="tab-count">{counts[f.id]}</span>
              </button>
            ))}
          </div>
          <input className="search" type="search" placeholder="Search by title or genre"
            aria-label="Search by title or genre" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <p className="muted">Loading your movies…</p>
        ) : visible.length === 0 ? (
          <div className="empty">
            {movies.length === 0
              ? <p>Your watchlist is empty. Add the first movie you've been meaning to see.</p>
              : <p>No movies match this filter. Try another tab or clear the search.</p>}
          </div>
        ) : (
          <ul className="tickets">
            {visible.map((movie) => (
              <li key={movie.id}>
                <TicketCard movie={movie}
                  onToggle={() => toggleWatched(movie)}
                  onEdit={() => openEdit(movie)}
                  onDelete={() => deleteMovie(movie)}
                  onRate={(rating) => patchMovie(movie, { rating })} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
