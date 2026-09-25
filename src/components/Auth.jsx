import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const isSignup = mode === 'signup'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      // If email confirmation is on, there is no session yet
      else if (!data.session) setNotice('Account created. Check your email to confirm it, then log in.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  function switchMode() {
    setMode(isSignup ? 'login' : 'signup')
    setError('')
    setNotice('')
  }

  return (
    <main className="center-screen">
      <div className="auth">
        <h1 className="brand brand-large">Movie Watchlist</h1>
        <p className="auth-intro">Keep track of what you want to see, and what you thought once you saw it.</p>

        <form className="panel" onSubmit={handleSubmit}>
          <h2 className="panel-title">{isSignup ? 'Create an account' : 'Log in'}</h2>

          <label className="field">
            <span>Email</span>
            <input type="email" autoComplete="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" required minLength={6}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password} onChange={(e) => setPassword(e.target.value)} />
            {isSignup && <small className="muted">At least 6 characters</small>}
          </label>

          {error && <p className="message message-error" role="alert">{error}</p>}
          {notice && <p className="message message-ok" role="status">{notice}</p>}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
          </button>

          <p className="switch">
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <button type="button" className="link" onClick={switchMode}>
              {isSignup ? 'Log in' : 'Create an account'}
            </button>
          </p>
        </form>
      </div>
    </main>
  )
}
