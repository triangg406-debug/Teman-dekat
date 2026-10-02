
import React, { useState } from 'react'

const profiles = [
  { id: 1, name: "Sari", age: 21, dist: "200m", hobby: "Ngopi santai", initial: "S", wa: "6281234567001" },
  { id: 2, name: "Bima", age: 23, dist: "450m", hobby: "Gym & futsal", initial: "B", wa: "6281234567002" },
  { id: 3, name: "Riko", age: 22, dist: "1.2km", hobby: "Nongkrong motor", initial: "R", wa: "6281234567003" },
  { id: 4, name: "Ayu", age: 20, dist: "800m", hobby: "Nonton drakor", initial: "A", wa: "6281234567004" },
  { id: 5, name: "Dinda", age: 22, dist: "300m", hobby: "Karaoke & cafe", initial: "D", wa: "6281234567005" },
  { id: 6, name: "Fajar", age: 24, dist: "600m", hobby: "Ngopi kerja remote", initial: "F", wa: "6281234567006" },
  { id: 7, name: "Lina", age: 21, dist: "1km", hobby: "Skincare & makeup", initial: "L", wa: "6281234567007" },
  { id: 8, name: "Yoga", age: 23, dist: "900m", hobby: "Travel Sukoharjo", initial: "Y", wa: "6281234567008" },
];

const packages = [
  { amount: 10000, label: "10k", sapa: 10, bonus: 0 },
  { amount: 25000, label: "25k", sapa: 25, bonus: 5 },
  { amount: 50000, label: "50k", sapa: 50, bonus: 15 },
  { amount: 100000, label: "100k", sapa: 100, bonus: 40 },
];

// GANTI INI JADI NOMOR DANA/WA KAMU ASLI
const ownerWA = "628187974771";

export default function App(){
  const [saldo, setSaldo] = useState(()=>{
    const s = localStorage.getItem('td_saldo'); return s ? parseInt(s) : 2500;
  });
  const [cuan, setCuan] = useState(()=>{
    const c = localStorage.getItem('td_cuan'); return c ? parseInt(c) : 0;
  });
  const [showTopup, setShowTopup] = useState(false);
  const [selected, setSelected] = useState(packages[1]);
  const [toast, setToast] = useState(null);

  const save = (s,c) => {
    localStorage.setItem('td_saldo', s); localStorage.setItem('td_cuan', c);
  }
  const pushToast = (m)=>{ setToast(m); setTimeout(()=>setToast(null),3000); }

  const handleSapa = (p) => {
    if(saldo < 1000){ pushToast("Saldo habis, topup dulu!"); setShowTopup(true); return; }
    const newSaldo = saldo - 1000;
    const newCuan = cuan + 800;
    setSaldo(newSaldo); setCuan(newCuan); save(newSaldo,newCuan);
    const msg = encodeURIComponent(`Hai ${p.name} dari TemanDekat! Aku di Sukoharjo ${p.dist} dari kamu, boleh kenalan?`);
    window.open(`https://wa.me/${p.wa}?text=${msg}`, "_blank");
    pushToast(`Sapa ke ${p.name} terkirim! Cuan +Rp 800`);
  };

  const handleTopup = () => {
    const total = selected.amount + selected.bonus * 1000;
    const newSaldo = saldo + total;
    setSaldo(newSaldo); save(newSaldo,cuan);
    const waText = encodeURIComponent(`Halo Admin TemanDekat, konfirmasi Topup ${selected.label} = Rp ${selected.amount}`);
    window.open(`https://wa.me/${ownerWA}?text=${waText}`, "_blank");
    pushToast(`Topup ${selected.label} berhasil! Saldo +Rp ${total}`);
    setShowTopup(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex justify-center">
      <div className="w-full max-w-[420px] bg-[#0f0a1e] min-h-screen relative">
        <div className="p-4 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0f0a1e]/90 backdrop-blur">
          <h1 className="font-black text-lg">TemanDekat PRO</h1>
          <div className="flex gap-2">
            <div className="bg-white/10 px-3 py-1 rounded-full text-xs">Cuan: Rp {cuan}</div>
            <div className="bg-purple-600 px-3 py-1 rounded-full text-sm font-bold">Rp {saldo}</div>
          </div>
        </div>

        <div className="p-3">
          <button onClick={()=>setShowTopup(true)} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 py-3 rounded-xl font-bold shadow-lg">+ Topup Saldo (10k-100k)</button>
        </div>

        <div className="p-3 space-y-3">
          {profiles.map(u=>(
            <div key={u.id} className="bg-[#1e1635] p-4 rounded-2xl flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-lg">{u.initial}</div>
                <div><div className="font-bold">{u.name}, {u.age} • {u.dist}</div><div className="text-xs text-zinc-400">{u.hobby}</div></div>
              </div>
              <button onClick={()=>handleSapa(u)} className="bg-purple-600 px-4 py-2 rounded-full text-sm font-bold active:scale-95">Sapa 1k</button>
            </div>
          ))}
        </div>

        <div className="p-4 text-center text-[11px] text-white/30">Mode Cuan: Tiap Sapa Rp 1.000 (Rp 800 masuk ke kamu) • Tarik minimal 20k ke DANA {ownerWA}</div>

        {showTopup && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
            <div className="bg-[#18122f] w-full max-w-[420px] rounded-t-[24px] p-5 border border-white/10">
              <div className="font-extrabold text-lg">Pilih Paket Topup</div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {packages.map(pkg=>{
                  const sel = selected.amount===pkg.amount;
                  return (
                    <button key={pkg.amount} onClick={()=>setSelected(pkg)} className={`text-left rounded-xl border p-3 ${sel ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 bg-[#1e1635]'}`}>
                      <div className="font-bold">{pkg.label}</div>
                      <div className="text-xs opacity-60">{pkg.sapa}+{pkg.bonus} Sapa</div>
                      <div className="text-sm font-bold text-purple-300 mt-1">Rp {pkg.amount}</div>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 bg-black/40 p-3 rounded-xl text-xs">
                Transfer ke DANA <b>{ownerWA}</b> / QRIS<br/>
                Nominal: Rp {selected.amount} = {selected.sapa+selected.bonus} Sapa<br/>
                Klik konfirmasi, saldo auto masuk (demo)
              </div>
              <button onClick={handleTopup} className="mt-4 w-full bg-purple-600 py-3 rounded-xl font-bold">Konfirmasi WA & Aktifkan {selected.sapa+selected.bonus} Sapa</button>
              <button onClick={()=>setShowTopup(false)} className="mt-2 w-full py-2 text-sm opacity-50">Batal</button>
            </div>
          </div>
        )}

        {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#231a44] border border-purple-500/30 px-4 py-3 rounded-xl text-sm shadow-xl z-50">{toast}</div>}
      </div>
    </div>
  )
}
