import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const GIFTS = [
  { id: 1, name: 'Bunga', icon: '🌹', koin: 10 },
  { id: 2, name: 'Kopi', icon: '☕', koin: 25 },
  { id: 3, name: 'Love', icon: '❤️', koin: 50 },
  { id: 4, name: 'Cincin', icon: '💍', koin: 100 },
  { id: 5, name: 'Mobil', icon: '🚗', koin: 500 },
  { id: 6, name: 'Crown', icon: '👑', koin: 1000 },
]

export default function App(){
  const [tab, setTab] = useState('radar')
  const [list, setList] = useState([])
  const [nama, setNama] = useState('')
  const [wa, setWa] = useState('')
  const [koin, setKoin] = useState(200)
  const [selected, setSelected] = useState(null)
  const [chat, setChat] = useState([])
  const [pesan, setPesan] = useState('')
  const [daysLeft, setDaysLeft] = useState(7)

  // INIT TRIAL 7 HARI
  useEffect(()=>{
    let saved = null
    try { saved = localStorage.getItem('teman_dekat_trial_start') } catch {}
    let start = saved ? new Date(saved) : new Date()
    if(!saved){
      try { localStorage.setItem('teman_dekat_trial_start', start.toISOString()) } catch {}
    }
    const diff = Math.floor((new Date() - start) / (1000*60*60*24))
    const left = 7 - diff
    setDaysLeft(left > 0 ? left : 0)
    loadData()
  },[])

  const isTrial = daysLeft > 0

  const loadData = async()=>{
    const {data} = await supabase.from('teman_dekat').select('*').order('id',{ascending:false})
    if(data) setList(data)
  }

  const daftar = async()=>{
    if(!nama || !wa) return alert('Isi nama & WA real!')
    const {error} = await supabase.from('teman_dekat').insert([{nama, no_wa: wa}])
    if(error) return alert(error.message)
    try { localStorage.setItem('teman_dekat_trial_start', new Date().toISOString()) } catch {}
    setDaysLeft(7)
    alert('DAFTAR REAL SUKSES! Kamu dapat TRIAL 7 HARI GRATIS - chat & radar tanpa koin!')
    setNama(''); setWa(''); loadData()
  }

  const kirimChat = ()=>{
    if(!pesan.trim()) return
    if(!isTrial && koin < 5) return alert('Trial habis! Koin habis, topup di Dompet dulu')
    if(!isTrial) setKoin(k=>k-5)
    setChat([...chat, {dari:'kamu', teks:pesan, gratis:isTrial}])
    setPesan('')
  }

  const kirimHadiah = (gift)=>{
    if(koin < gift.koin) return alert(`Koin kurang! Butuh ${gift.koin}, kamu ${koin}`)
    setKoin(k=>k-gift.koin)
    alert(`Kamu kirim ${gift.icon} ${gift.name} ke ${selected?.nama}! ${isTrial ? '(Trial: hadiah tetap pakai koin)' : `-${gift.koin} koin`}`)
  }

  return(
    <div className="min-h-screen bg-[#0f0a1e] text-white pb-24 font-sans">
      <div className={`p-3 text-center sticky top-0 z-20 font-black text-sm tracking-wide ${isTrial ? 'bg-green-400 text-black' : 'bg-yellow-400 text-black'}`}>
        {isTrial ? `🎉 TRIAL GRATIS ${daysLeft} HARI LAGI - Chat & Radar Free! • ${koin} KOIN` : `⚠️ TRIAL HABIS - Chat 5 Koin/Pesan • ${koin} KOIN`}
      </div>

      {tab==='radar' && (
        <div className="p-4">
          <h2 className="font-bold text-xl mb-1">📡 Radar - Orang Beneran</h2>
          <p className="text-xs text-zinc-400 mb-3">{isTrial ? `✅ Masa trial: Lihat & chat GRATIS ${daysLeft} hari. Hadiah tetap pakai koin.` : 'Trial habis: Chat butuh 5 koin per pesan.'}</p>
          {list.length===0 ? <p className="text-zinc-500 text-center mt-16">Belum ada orang beneran. Kamu daftar pertama!</p> :
            list.map(o=>(
              <div key={o.id} className="bg-zinc-900 p-4 rounded-2xl mt-3 flex justify-between items-center border border-zinc-800">
                <div>
                  <p className="font-bold">{o.nama}</p>
                  <p className="text-sm text-zinc-400">{o.no_wa}</p>
                  <p className="text-xs text-green-400 mt-1">● Online • Bisa dikasih hadiah</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>{setSelected(o); setTab('live')}} className="bg-pink-600 px-3 py-2 rounded-full text-sm font-bold">Live</button>
                  <button onClick={()=>{setSelected(o); setTab('chat')}} className={`px-3 py-2 rounded-full text-sm font-bold ${isTrial ? 'bg-green-500 text-black' : 'bg-yellow-400 text-black'}`}>{isTrial ? 'Chat Free' : 'Chat 5 Koin'}</button>
                </div>
              </div>
            ))
          }
          <div className="mt-8 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <p className="font-bold mb-2">Daftar Biar Dapat Trial 7 Hari:</p>
            <input value={nama} onChange={e=>setNama(e.target.value)} placeholder="Nama asli" className="w-full p-3 rounded-xl bg-black mb-2 outline-none border border-zinc-800"/>
            <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="WA 08xxx" className="w-full p-3 rounded-xl bg-black mb-3 outline-none border border-zinc-800"/>
            <button onClick={daftar} className="w-full bg-yellow-400 text-black p-3 rounded-xl font-black">DAFTAR + TRIAL 7 HARI</button>
          </div>
        </div>
      )}

      {tab==='live' && (
        <div className="p-4">
          <h2 className="font-bold text-xl mb-3">🔴 Live {selected?.nama ? `- ${selected.nama}` : ''}</h2>
          {selected ? (
            <>
              <div className="bg-zinc-900 rounded-2xl h-64 flex flex-col items-center justify-center border border-zinc-800">
                <div className="text-7xl">{selected.nama.charAt(0).toUpperCase()}</div>
                <div className="mt-3 font-bold">{selected.nama}</div>
                <div className="text-xs text-zinc-500">{selected.no_wa}</div>
              </div>
              <p className="text-center mt-3 text-zinc-400 text-sm">Kasih hadiah biar dia notice kamu!</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {GIFTS.map(g=>(
                  <button key={g.id} onClick={()=>kirimHadiah(g)} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 active:scale-95 transition">
                    <div className="text-3xl">{g.icon}</div>
                    <div className="font-bold text-sm mt-1">{g.name}</div>
                    <div className="text-xs text-yellow-400 mt-1">{g.koin} koin</div>
                  </button>
                ))}
              </div>
            </>
          ) : <p className="text-zinc-500 text-center mt-20">Pilih orang di Radar dulu baru bisa kasih hadiah</p>}
        </div>
      )}

      {tab==='chat' && (
        <div className="p-4">
          <h2 className="font-bold text-xl">💬 Chat {selected?.nama || ''} <span className="text-sm font-normal text-zinc-400">{isTrial ? '(GRATIS Trial)' : '(5 koin/pesan)'}</span></h2>
          <div className="bg-zinc-900 rounded-2xl p-4 mt-3 h-80 overflow-y-auto border border-zinc-800">
            {chat.map((c,i)=><p key={i} className="mt-2 text-sm"><b>{c.dari}:</b> {c.teks} {c.gratis && <span className="text-[10px] text-green-400 ml-1">[FREE]</span>}</p>)}
            {chat.length===0 && <p className="text-zinc-500 text-sm">{isTrial ? 'Trial aktif: Chat gratis 7 hari! Tulis bebas tanpa potong koin.' : 'Trial habis: Tiap pesan 5 koin. Topup di Dompet.'}</p>}
          </div>
          <div className="flex gap-2 mt-3">
            <input value={pesan} onChange={e=>setPesan(e.target.value)} placeholder={isTrial ? "Ketik gratis (trial)..." : "Ketik (5 koin)..."} className="flex-1 p-3 rounded-xl bg-black border border-zinc-800 outline-none"/>
            <button onClick={kirimChat} className="bg-yellow-400 text-black px-6 rounded-xl font-black">{isTrial ? 'Free' : '5 Koin'}</button>
          </div>
          {selected && <a href={`https://wa.me/${selected.no_wa.replace(/\D/g,'')}`} target="_blank" className="block text-center mt-4 bg-green-500 text-black p-3 rounded-xl font-bold">Lanjut WA Real</a>}
        </div>
      )}

      {tab==='dompet' && (
        <div className="p-4">
          <h2 className="font-bold text-xl mb-3">💰 Dompet</h2>
          <div className="bg-zinc-900 p-6 rounded-2xl text-center border border-zinc-800">
            <p className="text-zinc-400 text-sm">{isTrial ? `Masa Trial ${daysLeft} hari lagi` : 'Trial Habis'}</p>
            <p className="text-5xl font-black text-yellow-400 mt-2">{koin}</p>
            <p className="text-xs text-zinc-500 mt-2">{isTrial ? 'Chat & radar gratis dulu, hadiah tetap pakai koin biar ada pemasukan' : 'Semua fitur sekarang pakai koin'}</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={()=>setKoin(k=>k+100)} className="bg-zinc-800 p-3 rounded-xl font-bold">Topup 100 = Rp 10k</button>
              <button onClick={()=>setKoin(k=>k+500)} className="bg-yellow-400 text-black p-3 rounded-xl font-bold">Topup 500 = Rp 40k</button>
            </div>
            <p className="text-[11px] text-zinc-600 mt-4">DANA • ShopeePay • OVO • GoPay - kayak versi lengkap kemarin</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around p-2 z-20">
        <button onClick={()=>setTab('radar')} className={`p-3 rounded-xl text-sm ${tab==='radar'?'bg-yellow-400 text-black font-black':'text-zinc-400'}`}>Radar</button>
        <button onClick={()=>setTab('live')} className={`p-3 rounded-xl text-sm ${tab==='live'?'bg-yellow-400 text-black font-black':'text-zinc-400'}`}>Live 🎁</button>
        <button onClick={()=>setTab('chat')} className={`p-3 rounded-xl text-sm ${tab==='chat'?'bg-yellow-400 text-black font-black':'text-zinc-400'}`}>Chat {isTrial && '•Free'}</button>
        <button onClick={()=>setTab('dompet')} className={`p-3 rounded-xl text-sm ${tab==='dompet'?'bg-yellow-400 text-black font-black':'text-zinc-400'}`}>Dompet</button>
      </div>
    </div>
  )
}
