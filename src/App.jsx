import { useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabaseClient'
import Auth from './components/Auth'
import Watchlist from './components/Watchlist'

export default function App() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isConfigured) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!isConfigured) {
    return (
      <main className="center-screen">
        <div className="panel">
          <h1 className="panel-title">Almost there</h1>
          <p>
            Supabase isn't connected yet. Copy <code>.env.example</code> to <code>.env</code>, add your
            project URL and key, then restart the dev server. On Netlify, add the same two values under
            Site configuration &gt; Environment variables.
          </p>
        </div>
      </main>
    )
  }

  if (checking) {
    return <main className="center-screen"><p className="muted">Loading…</p></main>
  }

  return session ? <Watchlist session={session} /> : <Auth />
}
