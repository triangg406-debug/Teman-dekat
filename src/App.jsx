import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function App(){
  const [tab, setTab] = useState('radar')
  const [list, setList] = useState([])
  const [nama, setNama] = useState('')
  const [wa, setWa] = useState('')
  const [coin, setCoin] = useState(50)

  const load = async()=>{
    const { data } = await supabase.from('teman_dekat').select('*').order('id',{ascending:false})
    if(data) setList(data)
  }
  useEffect(()=>{ load() },[])

  const daftar = async()=>{
    if(!nama || !wa) return alert('Isi nama & WA real!')
    const { error } = await supabase.from('teman_dekat').insert([{ nama, no_wa: wa }])
    if(error) return alert(error.message)
    alert('UDAH MASUK REAL! Kamu sekarang muncul di HP orang lain')
    setNama(''); setWa(''); load()
  }

  const chat = (no) =>{
    if(coin < 10) return alert('Coin habis! Top up di Dompet')
    setCoin(c=>c-10)
    window.open(`https://wa.me/${no.replace(/\D/g,'')}`,'_blank')
  }

  return(
    <div className="min-h-screen bg-[#0f0a1e] text-white pb-24">
      <div className="p-4 bg-yellow-400 text-black font-black text-center sticky top-0 z-10">
        TEMAN DEKAT • REAL {list.length} ORANG • COIN: {coin}
      </div>

      {tab==='radar' && (
        <div className="p-4">
          {list.length===0 ? <p className="text-center text-zinc-500 mt-20">Belum ada orang beneran.<br/>Kamu daftar pertama di bawah.<br/>Ini REAL dari Supabase kamu kemarin.</p> :
            list.map(o=>(
              <div key={o.id} className="bg-zinc-900 p-4 rounded-2xl mt-3 flex justify-between items-center">
                <div><p className="font-bold text-lg">{o.nama}</p><p className="text-sm text-zinc-400">{o.no_wa}</p><p className="text-xs text-green-400 mt-1">● Orang Beneran • {o.jarak || 'Deket'}</p></div>
                <button onClick={()=>chat(o.no_wa)} className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold">Chat -10</button>
              </div>
            ))
          }
          <div className="fixed bottom-20 left-0 right-0 bg-zinc-900 p-4 border-t border-zinc-800">
            <input value={nama} onChange={e=>setNama(e.target.value)} placeholder="Nama asli REAL" className="w-full p-3 rounded-xl bg-black mb-2"/>
            <input value={wa} onChange={e=>setWa(e.target.value)} placeholder="WA asli REAL 08xxx" className="w-full p-3 rounded-xl bg-black mb-2"/>
            <button onClick={daftar} className="w-full bg-yellow-400 text-black p-3 rounded-xl font-black">DAFTAR MASUK RADAR REAL</button>
          </div>
        </div>
      )}

      {tab==='live' && <div className="p-10 text-center text-zinc-500">Fitur LIVE - Nanti list yang lagi live dari Supabase<br/>Fitur kamu yang kemarin gue pertahanin, gak gue hapus</div>}
      {tab==='dompet' && <div className="p-4"><div className="bg-zinc-900 p-6 rounded-2xl text-center"><p className="text-zinc-400">Saldo Coin</p><p className="text-4xl font-black text-yellow-400">{coin}</p><div className="grid grid-cols-2 gap-2 mt-6"><button className="bg-white text-black p-3 rounded-xl font-bold">Topup DANA</button><button className="bg-white text-black p-3 rounded-xl font-bold">ShopeePay</button><button className="bg-white text-black p-3 rounded-xl font-bold">GoPay</button><button className="bg-white text-black p-3 rounded-xl font-bold">OVO</button></div></div></div>}

      <div className="fixed bottom-0 left-0 right-0 bg-black flex justify-around p-3 border-t border-zinc-800">
        <button onClick={()=>setTab('radar')} className={tab==='radar'?'text-yellow-400 font-bold':'text-zinc-500'}>Radar</button>
        <button onClick={()=>setTab('live')} className={tab==='live'?'text-yellow-400 font-bold':'text-zinc-500'}>Live</button>
        <button onClick={()=>setTab('dompet')} className={tab==='dompet'?'text-yellow-400 font-bold':'text-zinc-500'}>Dompet</button>
      </div>
    </div>
  )
}
