export default function TicketCard({ movie, onToggle, onEdit, onDelete, onRate }) {
  const watched = movie.status === 'watched'

  return (
    <article className={`ticket ${watched ? 'ticket-watched' : ''}`}>
      <div className="ticket-main">
        <h3 className="ticket-title">{movie.title}</h3>
        {movie.genre && <p className="ticket-genre">{movie.genre}</p>}
        {movie.notes && <p className="ticket-notes">{movie.notes}</p>}

        <div className="ticket-actions">
          <button className="btn btn-small btn-dark" onClick={onToggle}>
            {watched ? 'Move back to watchlist' : 'Mark as watched'}
          </button>
          <button className="btn btn-small btn-outline" onClick={onEdit}>Edit</button>
          <button className="btn btn-small btn-outline" onClick={onDelete}>Remove</button>
        </div>
      </div>

      <div className="ticket-stub">
        <span className="stub-year">{movie.release_year ?? '—'}</span>
        {watched ? (
          <>
            <span className="stamp" aria-hidden="true">Seen</span>
            <div className="stars" role="group" aria-label={`Rating for ${movie.title}`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button"
                  className={`star ${movie.rating >= n ? 'star-on' : ''}`}
                  aria-label={`Rate ${n} out of 5`}
                  aria-pressed={movie.rating === n}
                  onClick={() => onRate(movie.rating === n ? null : n)}>
                  ★
                </button>
              ))}
            </div>
          </>
        ) : (
          <span className="stub-label">Admit one</span>
        )}
      </div>
    </article>
  )
}
