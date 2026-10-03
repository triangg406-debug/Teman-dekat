import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'

function App() {
  const [user, setUser] = useState(null)
  const [teman, setTeman] = useState([])
  const [nama, setNama] = useState('')
  const [wa, setWa] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Cek login
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadTeman()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadTeman()
      else setTeman([])
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load data teman dekat
  const loadTeman = async () => {
    const { data, error } = await supabase.from('teman_dekat').select('*').order('created_at', { ascending: false })
    if (!error) setTeman(data)
  }

  // Auth
  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) alert(error.message)
    else alert('Cek email mu buat verifikasi!')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) alert(error.message)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // CRUD Teman
  const tambahTeman = async (e) => {
    e.preventDefault()
    if (!nama) return
    const { error } = await supabase.from('teman_dekat').insert([{ nama, no_wa: wa, user_id: user.id }])
    if (!error) {
      setNama('')
      setWa('')
      loadTeman()
    } else alert(error.message)
  }

  const hapusTeman = async (id) => {
    await supabase.from('teman_dekat').delete().eq('id', id)
    loadTeman()
  }

  // UI Login
  if (!user) {
    return (
      <div style={{ maxWidth: 360, margin: '40px auto', fontFamily: 'sans-serif', padding: 20 }}>
        <h1>Teman Dekat - Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 12 }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 12 }} />
          <button type="submit" disabled={loading} style={{ padding: 12, background: 'black', color: 'white' }}>{loading ? 'Loading...' : 'Login'}</button>
          <button type="button" onClick={handleSignUp} style={{ padding: 12 }}>Daftar Akun Baru</button>
        </form>
      </div>
    )
  }

  // UI Utama
  return (
    <div style={{ maxWidth: 400, margin: '20px auto', fontFamily: 'sans-serif', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Halo, {user.email}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={tambahTeman} style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '20px 0', border: '1px solid #ddd', padding: 15, borderRadius: 10 }}>
        <h3>Tambah Teman Dekat</h3>
        <input placeholder="Jeneng" value={nama} onChange={e => setNama(e.target.value)} style={{ padding: 10 }} required />
        <input placeholder="No WA (opsional)" value={wa} onChange={e => setWa(e.target.value)} style={{ padding: 10 }} />
        <button type="submit" style={{ padding: 10, background: '#25D366', color: 'white', border: 'none', borderRadius: 5 }}>Simpan</button>
      </form>

      <h3>Daftar Teman ({teman.length})</h3>
      {teman.map(t => (
        <div key={t.id} style={{ border: '1px solid #eee', padding: 10, borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <b>{t.nama}</b><br />
            <small>{t.no_wa}</small>
          </div>
          <button onClick={() => hapusTeman(t.id)} style={{ color: 'red' }}>Hapus</button>
        </div>
      ))}
    </div>
  )
}

export default App
