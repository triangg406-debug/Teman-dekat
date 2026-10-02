import React, { useState } from 'react'

export default function App(){
  const [saldo,setSaldo] = useState(47500)
  const [tab,setTab] = useState('dekat')
  const [sapa,setSapa] = useState([])

  const users = [
    { id:1, n:'Sari, 21', j:'200m dari kamu', h:'Cari teman ngopi • Sukoharjo', o:true, i:'S' },
    { id:2, n:'Bima, 23', j:'450m dari kamu', h:'Futsal sore ini @Lapangan Joho', o:true, i:'B' },
    { id:3, n:'Riko, 22', j:'1.2km', h:'Mabar ML & nongkrong', o:false, i:'R' },
    { id:4, n:'Ayu, 20', j:'800m', h:'Cari teman nonton bioskop', o:true, i:'A' },
    { id:5, n:'Dian, 22', j:'300m', h:'Baru pindah ke Sukoharjo', o:true, i:'D' },
  ]

  const sapaUser = (id) => {
    if(sapa.includes(id)) return
    setSapa([...sapa, id])
    setSaldo(s=>s+500)
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex justify-center">
      <div className="w-full max-w-[420px] bg-[#0f0a1e] min-h-screen relative pb-20">
        {/* HEADER */}
        <div className="p-4 flex justify-between items-center sticky top-0 bg-[#0f0a1e] z-10">
          <h1 className="font-black text-xl">Teman<span className="text-purple-400">Dekat</span> 📍</h1>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1.5 rounded-full text-sm font-bold">Rp {saldo.toLocaleString('id-ID')}</div>
        </div>

        {/* TAB DEKAT */}
        {tab==='dekat' && <div className="p-4 space-y-3">
          <div className="text-sm text-zinc-400">Orang di sekitar Sukoharjo • Online sekarang</div>
          {users.map(u=><div key={u.id} className="bg-[#1e1635] border border-white/5 p-4 rounded-[20px] flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">{u.i}</div>
              <div>
                <div className="font-bold text-[15px]">{u.n} <span className="text-xs font-normal text-zinc-400">• {u.j}</span></div>
                <div className="text-[12px] text-zinc-400 mt-0.5">{u.h} {u.o && <span className="text-green-400">• Online</span>}</div>
              </div>
            </div>
            <button onClick={()=>sapaUser(u.id)} className={`${sapa.includes(u.id)?'bg-zinc-700 text-zinc-400':'bg-purple-600'} px-4 py-2 rounded-full text-xs font-bold`}>
              {sapa.includes(u.id)?'Disapa':'Sapa +500'}
            </button>
          </div>)}

          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-5 rounded-[20px] mt-5">
            <div className="font-black">Misi Cuan Hari Ini 💰</div>
            <div className="text-sm opacity-90 mt-1">Sapa 5 teman = Rp 2.500 • Undang teman dapat Rp 5.000</div>
            <div className="flex gap-2 mt-3">
              <button onClick={()=>setSaldo(s=>s+2500)} className="bg-white text-purple-700 px-4 py-2 rounded-full font-bold text-sm">Klaim Rp 2.500</button>
              <button className="bg-black/20 px-4 py-2 rounded-full text-sm">Undang Teman</button>
            </div>
          </div>

          <div className="bg-[#1a1230] p-4 rounded-[20px] border border-white/5 text-xs text-zinc-400">
            <b className="text-white">Kamu adalah Owner!</b> Semua transaksi VIP Rp 19.000 & Boost Rp 5.000 masuk ke kamu (setelah ini sambung ke payment gateway).
          </div>
        </div>}

        {/* TAB CUAN */}
        {tab==='cuan' && <div className="p-4 space-y-4">
          <div className="bg-[#1e1635] p-5 rounded-[20px]">
            <div className="font-black text-lg">Bagaimana Kamu Dapat Uang?</div>
            <div className="text-sm text-zinc-300 mt-3 space-y-3 leading-relaxed">
              <div>✅ <b>VIP Rp 19.000</b> - User bayar biar bisa chat unlimited. 100% masuk ke kamu.</div>
              <div>✅ <b>Boost Rp 5.000</b> - Biar profil naik ke atas. 100% masuk ke kamu.</div>
              <div>✅ <b>Event Berbayar</b> - Kamu bikin event nongkrong Rp 20rb/orang, kamu ambil 15%.</div>
              <div>✅ <b>Iklan Lokal</b> - Warung kopi mau promo di app kamu Rp 100rb/minggu.</div>
            </div>
          </div>
          <div className="bg-white text-black p-5 rounded-[20px] text-center">
            <div className="text-sm">Estimasi jika ada 1.000 user di Sukoharjo</div>
            <div className="font-black text-2xl mt-1">Rp 3-7
