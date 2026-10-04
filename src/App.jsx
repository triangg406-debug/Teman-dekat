import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App(){
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('td_user') || 'null'))
  const [users,setUsers]=useState([])
  const [pos,setPos]=useState(null)
  const [tab,setTab]=useState('dekat')
  const [nama,setNama]=useState('')
  const [wa,setWa]=useState('')
  const [coins,setCoins]=useState(()=>Number(localStorage.getItem('td_coins')||47500))
  const [trialStart,setTrialStart]=useState(()=>localStorage.getItem('td_trial')||new Date().toISOString())
  const [showTopup,setShowTopup]=useState(false)
  const [showGift,setShowGift]=useState(null)
  const [saldoRp,setSaldoRp]=useState(()=>Number(localStorage.getItem('td_rp')||0))
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    if(!localStorage.getItem('td_trial')) localStorage.setItem('td_trial',trialStart)
    navigator.geolocation.getCurrentPosition(p=>setPos({lat:p.coords.latitude,lng:p.coords.longitude}),()=>{})
    supabase.from('teman_dekat').select('*').order('id',{ascending:false}).then(r=>{if(r.data)setUsers(r.data)})
  },[])
  useEffect(()=>{localStorage.setItem('td_coins',coins)},[coins])
  useEffect(()=>{localStorage.setItem('td_rp',saldoRp)},[saldoRp])

  // TRIAL 7 HARI
  const trialDaysLeft=()=>{
    const diff=Date.now()-new Date(trialStart).getTime()
    const days=Math.floor(diff/86400000)
    return Math.max(0,7-days)
  }
  const isTrial=trialDaysLeft()>0

  const login = async()=>{
    if(!nama||!wa) return alert('Isi nama & WA!')
    setLoading(true)
    const { data } = await supabase.from('teman_dekat').select('*').eq('nama',nama).eq('no_wa',wa).limit(1)
    setLoading(false)
    if(data && data.length>0){
      localStorage.setItem('td_user', JSON.stringify(data[0]))
      setUser(data[0])
    } else {
      alert('Akun belum ada. Klik DAFTAR dulu')
    }
  }

  const daftar=async()=>{
    if(!nama||!wa) return alert('Isi nama & WA!')
    setLoading(true)
    const { data, error } = await supabase.from('teman_dekat').insert([{nama,no_wa:wa,foto_url:`https://i.pravatar.cc/150?u=${nama}`,lat:pos?.lat,lng:pos?.lng}]).select()
    setLoading(false)
    if(error) return alert(error.message)
    localStorage.setItem('td_user', JSON.stringify(data[0]))
    localStorage.setItem('td_trial', new Date().toISOString())
    setUser(data[0])
    alert('DAFTAR REAL + Trial 7 hari aktif!')
  }

  const logout=()=>{
    localStorage.removeItem('td_user')
    setUser(null)
  }

  const handleChat=(u)=>{
    if(isTrial){
      window.open(`https://wa.me/${(u.no_wa||'').replace(/\D/g,'')}?text=Hai ${u.nama}`,'_blank')
    }else{
      if(coins<200){setShowTopup(true);return}
      setCoins(c=>c-200)
      window.open(`https://wa.me/${(u.no_wa||'').replace(/\D/g,'')}`,'_blank')
    }
  }

  const handleVideo=(u)=>{
    if(isTrial){
      alert(`Video call ${u.nama} - FREE trial`)
    }else{
      if(coins<500){setShowTopup(true);return}
      setCoins(c=>c-500)
      alert(`Video call ${u.nama} -500 koin`)
    }
  }

  // GIFT TETEP PAKE POIN WALAU TRIAL
  const kirimHadiah=(u,gift)=>{
    if(coins<gift.coin){setShowTopup(true);return}
    setCoins(c=>c-gift.coin)
    const dapat=Math.floor(gift.rp*0.7)
    setSaldoRp(r=>r+dapat)
    alert(`Kirim ${gift.name} ke ${u.nama}! Kamu kepotong ${gift.coin} poin. Penerima dapat Rp ${dapat}`)
    setShowGift(null)
  }

  const topup=(p)=>{
    setCoins(c=>c+p.coin)
    setShowTopup(false)
    alert(`Topup +${p.coin} koin berhasil!`)
  }

  // HALAMAN LOGIN
  if(!user){
    return(
      <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col justify-center p-6">
        <h1 className="text-4xl font-black text-center text-yellow-400">TEMAN DEKAT</h1>
        <p className="text-center text-zinc-400 mt-2">MAHA - Trial 7 Hari Gratis</p>
        <div className="bg-zinc-900 p-6 rounded-3xl mt-8">
          <input value={nama} onChange={e=>setNama(e.target.value)} placeholder="Nama REAL" className="w-full p-4 rounded-xl bg-black mb-3"/>
          <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="WA REAL 08xxx" className="w-full p-4 rounded-xl bg-black mb-4"/>
          <button onClick={login} disabled={loading} className="w-full bg-yellow-400 text-black p-4 rounded-xl font-black mb-3">{loading?'...':'LOGIN'}</button>
          <button onClick={daftar} disabled={loading} className="w-full bg-zinc-800 text-white p-4 rounded-xl font-bold">DAFTAR + DAPAT TRIAL 7 HARI</button>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-[#0f0a1a] text-white pb-24">
      <div className="flex justify-between items-center p-4 bg-yellow-400 text-black sticky top-0 z-10">
        <span className="font-black">MAHA {users.length} ORANG • {coins} POIN</span>
        <button onClick={logout} className="bg-black text-yellow-400 px-4 py-1 rounded-full text-xs font-bold">LOGOUT</button>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-[#1c1633] rounded-2xl p-3 text-xs flex justify-between">
          <span className={isTrial?'text-green-400':'text-red-400'}>{isTrial?`✅ Trial ${trialDaysLeft()} hari lagi - Chat & Radar GRATIS`:'⚠️ Trial habis - Chat 200 poin'}</span>
          <span className="text-yellow-400">Saldo hadiah Rp {saldoRp}</span>
        </div>
      </div>

      {tab==='dekat' && (
        <div className="px-4 mt-3">
          {users.filter(u=>u.id!==user.id).map(u=>(
            <div key={u.id} className="bg-[#1e1740] rounded-[20px] p-4 mt-3 flex items-center gap-3">
              <img src={u.foto_url || `https://i.pravatar.cc/150?u=${u.nama}`} className="w-12 h-12 rounded-full"/>
              <div className="flex-1"><p className="font-bold">{u.nama}</p><p className="text-xs text-zinc-400">REAL • {u.no_wa}</p></div>
              <div className="flex gap-2">
                <button onClick={()=>setShowGift(u)} className="bg-yellow-400 text-black px-3 py-2 rounded-full text-xs font-black">Gift Poin</button>
                <button onClick={()=>handleChat(u)} className="bg-[#8b5cf6] px-4 py-2 rounded-full text-xs font-bold">{isTrial?'Chat FREE':'Chat 200'}</button>
              </div>
            </div>
          ))}
          {users.filter(u=>u.id!==user.id).length===0 && <p className="text-center text-zinc-500 mt-10">Belum ada orang. Ajak teman daftar, trial 7 hari gratis.</p>}
        </div>
      )}

      {tab==='chat' && <div className="p-4 mt-3"><p className="text-zinc-400 text-sm">Chat {isTrial?'FREE trial 7 hari':'200 poin per chat'}</p>{users.filter(u=>u.id!==user.id).map(u=>(<div key={u.id} className="bg-[#1e1740] p-4 rounded-2xl mt-2 flex justify-between"><span>{u.nama}</span><button onClick={()=>handleChat(u)} className="bg-[#8b5cf6] px-4 py-1 rounded-full text-xs">Chat</button></div>))}</div>}
      {tab==='video' && <div className="p-4 mt-3"><p className="text-zinc-400 text-sm">Video {isTrial?'FREE trial':'500 poin'}</p>{users.filter(u=>u.id!==user.id).map(u=>(<div key={u.id} className="bg-[#1e1740] p-4 rounded-2xl mt-2 flex justify-between"><span>{u.nama}</span><button onClick={()=>handleVideo(u)} className="bg-pink-500 px-4 py-1 rounded-full text-xs">Video</button></div>))}</div>}
      {tab==='profil' && (
        <div className="p-4">
          <div className="bg-[#1e1740] rounded-2xl p-5"><p className="font-bold">{user.nama}</p><p className="text-xs text-zinc-400">{user.no_wa}</p><p className="mt-2 text-sm">{isTrial?`Sisa trial ${trialDaysLeft()} hari - Radar & Chat GRATIS, Gift tetep pake poin`:'Trial habis'}</p><p className="text-yellow-400 mt-2">Poin: {coins} | Saldo hadiah: Rp {saldoRp}</p><button onClick={logout} className="w-full mt-4 bg-red-500 p-3 rounded-xl font-bold">LOGOUT</button></div>
        </div>
      )}

      {showTopup && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
          <div className="bg-[#1e1740] w-full max-w-md rounded-t-[24px] p-5">
            <p className="font-black">
