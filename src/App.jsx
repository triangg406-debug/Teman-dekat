import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function jarak(lat1, lon1, lat2, lon2){
  const R=6371
  const dLat=(lat2-lat1)*Math.PI/180
  const dLon=(lon2-lon1)*Math.PI/180
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

export default function App(){
  const [tab,setTab]=useState('radar')
  const [users,setUsers]=useState([])
  const [pos,setPos]=useState(null)
  const [nama,setNama]=useState('')
  const [wa,setWa]=useState('')
  const [coin,setCoin]=useState(1000)
  const [chatUser,setChatUser]=useState(null)

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(p=>{
      setPos({lat:p.coords.latitude,lng:p.coords.longitude})
    })
    load()
  },[])

  const load = async()=>{
    const {data}=await supabase.from('teman_dekat').select('*').order('id',{ascending:false})
    if(data) setUsers(data)
  }

  const daftar = async()=>{
    if(!nama||!wa) return alert('Isi nama & WA real!')
    if(!pos) return alert('Aktifin GPS dulu!')
    await supabase.from('teman_dekat').insert([{
      nama, no_wa: wa,
      foto_url: `https://i.pravatar.cc/300?u=${nama}${Date.now()}`,
      lat: pos.lat, lng: pos.lng
    }])
    alert('BERHASIL REAL! Kamu muncul di radar orang lain!')
    setNama(''); setWa(''); load()
  }

  return(
    <div className="min-h-screen bg-[#0f0a1e] text-white pb-24">
      <div className="p-3 border-b border-zinc-800 flex justify-between">
        <h1 className="font-black">TemanDekat <span className="text-yellow-400">REAL</span></h1>
        <span className="bg-zinc-900 px-3 py-1 rounded-full text-sm">{coin} coin</span>
      </div>

      {tab==='radar' && (
        <div className="p-4">
          <p className="text-xs text-zinc-500">{users.length} orang beneran dari Supabase kamu</p>
          {users.map(u=>{
            const j = pos ? jarak(pos.lat,pos.lng,u.lat||-7.59,u.lng||110.82).toFixed(1) : '?'
            return(
              <div key={u.id} className="bg-zinc-900 rounded-2xl p-3 mt-3 flex gap-3">
                <img src={u.foto_url} className="w-14 h-14 rounded-full"/>
                <div className="flex-1">
                  <p className="font-bold">{u.nama} • {j} km</p>
                  <p className="text-sm text-zinc-400">{u.no_wa}</p>
                  <p className="text-xs text-green-400">● Orang Beneran REAL</p>
                  <button onClick={()=>{if(coin<500)return alert('Topup dulu!'); setCoin(c=>c-500); setChatUser(u); setTab('chat')}} className="mt-2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">Chat 500</button>
                </div>
              </div>
            )
          })}
          <div className="bg-zinc-900 p-4 rounded-2xl mt-6">
            <input value={nama} onChange={e=>setNama(e.target.value)} placeholder="Nama asli REAL" className="w-full p-3 rounded-xl bg-black mb-2"/>
            <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="WA asli 08xxx" className="w-full p-3 rounded-xl bg-black mb-2"/>
            <button onClick={daftar} className="w-full bg-yellow-400 text-black p-3 rounded-xl font-black">DAFTAR REAL</button>
          </div>
        </div>
      )}

      {tab==='chat' && <div className="p-4">{!chatUser ? <p className="text-center text-zinc-500 mt-20">Pilih di Radar dulu</p> : <><p className="font-bold">Chat {chatUser.nama} REAL</p><p className="text-sm text-zinc-500 mt-2">Chat real, bukan bot Sari lagi.</p></>}</div>}
      {tab==='live' && <div className="p-10 text-center text-zinc-500">Live: {users.length} orang online REAL</div>}
      {tab==='dompet' && <div className="p-4"><div className="bg-yellow-400 text-black p-6 rounded-2xl font-black text-2xl">{coin} Coins</div><div className="grid grid-cols-2 gap-2 mt-4">{['DANA','ShopeePay','GoPay','OVO','Pulsa','PayPal'].map(x=><button key={x} onClick={()=>setCoin(c=>c+1000)} className="bg-zinc-900 p-4 rounded-xl">{x}</button>)}</div></div>}

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 flex justify-around p-2">
        {['radar','chat','live','dompet'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-5 py-2 rounded-xl ${tab===t?'bg-yellow-400 text-black font-bold':'text-zinc-400'}`}>{t}</button>
        ))}
      </div>
    </div>
  )
}
