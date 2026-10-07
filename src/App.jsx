import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const OWNER_NAME = 'triangga';
const OWNER_EMAIL = 'triangga406@gmail.com';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('td_user')||'null'));
  const [role, setRole] = useState(localStorage.getItem('td_role')||null);
  const [view, setView] = useState(user? (localStorage.getItem('td_role')==='OWNER'?'owner':'radar') : 'login');
  const [users, setUsers] = useState([]); // REAL SOKO SUPABASE
  const [saldo, setSaldo] = useState(0);
  const [transaksi, setTransaksi] = useState([]);
  const [target, setTarget] = useState(null);
  const [radius, setRadius] = useState(500);
  const [asistenStep, setAsistenStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const asistenTexts = [
    "Halo bro! Aktifke GPS disek ben radar iso muter.",
    "Saiki radar kosong mergo urung enek user real. Undang koncomu daftar bro!",
    "Nek enek wong daftar, langsung ketok jarak meter e neng radar REAL Supabase.",
    "Chat real, gift real, dompet real - kabeh mlebu Supabase mu.",
    "Top Up 50rb syarat Live 10 orang, duite real iso di-WD ke DANA/SeaBank 9011****."
  ];

  useEffect(()=>{
    // LOAD MIDTRANS SNAP REAL
    const s=document.createElement("script");
    s.src="https://app.midtrans.com/snap/snap.js";
    s.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
    document.body.appendChild(s);
    if(user) fetchReal();
  },[]);

  const fetchReal = async () => {
    const { data } = await supabase.from('teman_dekat').select('*').order('created_at',{ascending:false}).limit(50);
    if(data) setUsers(data);
    if(user){
      const { data: me } = await supabase.from('teman_dekat').select('saldo').eq('email', user.email).single();
      if(me) setSaldo(me.saldo||0);
      const { data: trx } = await supabase.from('transaksi').select('*').eq('user', user.email).order('created_at',{ascending:false});
      if(trx) setTransaksi(trx);
    }
  };

  const isOwner = (n,e) => n.toLowerCase()===OWNER_NAME || e.toLowerCase()===OWNER_EMAIL;

  const login = async (n,e) => {
    if(!n ||!e){ alert("Isi nama & email!"); return; }
    setLoading(true);
    try{
      const { data: exist } = await supabase.from('teman_dekat').select('*').eq('email', e).single();
      let saldoAwal = 0;
      if(!exist){
        // DAFTAR REAL BARU
        const { error } = await supabase.from('teman_dekat').insert({
          username: n, name: n, email: e, kontak: e, saldo: 10000, coins: 100, jarak: Math.floor(Math.random()*400)+20
        });
        if(error) throw error;
        saldoAwal = 10000;
        await supabase.from('transaksi').insert({ user: e, jenis: 'Bonus Daftar Real', harga: 10000, status: 'sukses' });
      } else {
        saldoAwal = exist.saldo;
      }
      const r = isOwner(n,e)? 'OWNER' : 'USER';
      const u = {name:n, email:e, role:r};
      setUser(u); setRole(r); setSaldo(r==='OWNER'?999999999:saldoAwal);
      localStorage.setItem('td_user', JSON.stringify(u));
      localStorage.setItem('td_role', r);
      setView(r==='OWNER'?'owner':'radar');
      fetchReal();
    }catch(err){ alert("Error Supabase: "+err.message+" - cek tabel teman_dekat mu"); }
    setLoading(false);
  };

  const topupReal = async (nom) => {
    try{
      const res=await fetch('/api/midtrans',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:nom, user:user.email})});
      const {token}=await res.json();
      window.snap.pay(token,{
        onSuccess: async ()=>{
          const newSaldo = saldo + nom;
          setSaldo(newSaldo);
          await supabase.from('teman_dekat').update({saldo:newSaldo}).eq('email', user.email);
          await supabase.from('transaksi').insert({user:user.email, jenis:'topup', harga:nom, status:'sukses', bank:'SeaBank 9011****'});
          alert(`Topup REAL Rp ${nom.toLocaleString()} sukses!`);
          fetchReal();
        }
      });
    }catch{ alert("API /api/midtrans mu durung ready - set neng Vercel"); }
  };

  if(view==='login'){
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-black text-white p-6 flex flex-col justify-center">
        <h1 className="text-3xl font-black">TemanDekat</h1>
        <p className="text-sm text-zinc-400">REAL Supabase • Tanpa Demo • Asisten Aktif</p>
        <div className="mt-2 bg-blue-900/30 border border-blue-800 p-3 rounded-xl">
          <p className="text-xs font-bold text-blue-300">🤖 Asisten: {asistenTexts[0]}</p>
        </div>
        <div className="mt-6 bg-zinc-900 p-4 rounded-2xl">
          <input id="nm" placeholder="Nama (triangga = owner)" className="w-full p-3 bg-zinc-800 rounded-xl text-sm outline-none" />
          <input id="em" placeholder="Email Real (masuk Supabase)" className="w-full mt-3 p-3 bg-zinc-800 rounded-xl text-sm outline-none" />
          <button onClick={()=>{const n=document.getElementById('nm').value; const e=document.getElementById('em').value; login(n,e)}} disabled={loading} className="w-full mt-4 bg-white text-black py-3 rounded-xl font-bold disabled:opacity-50">{loading?'Nyambung Supabase...':'Masuk (Real Supabase)'}</button>
          <p className="text-[10px] text-zinc-500 mt-2 text-center">Data langsung mlebu tabel teman_dekat • Radar REAL</p>
        </div>
      </div>
    )
  }

  if(role==='OWNER' && view==='owner'){
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-black text-white pb-20">
        <div className="p-4 bg-zinc-900"><h1 className="font-bold">Dashboard Pemilik - {user.name} 👑DEWA</h1><p className="text-xs text-zinc-400">{user.email} • SeaBank 9011**** Rahasia</p></div>
        <div className="p-4 space-y-4">
          <div className="bg-blue-900/20 border border-blue-800 p-3 rounded-xl"><p className="text-xs font-bold">🤖 Asisten Owner:</p><p className="text-xs mt-1">Saiki user REAL {users.length} orang soko Supabase. Demo Rina Budi wes tak guwak total.</p></div>
          <div className="grid grid-cols-2 gap-3"><div className="bg-green-900/30 p-3 rounded-xl"><p className="text-xs">User Real</p><p className="font-bold">{users.length} orang</p></div><div className="bg-zinc-900 p-3 rounded-xl"><p className="text-xs">Uang Masuk Real</p><p className="font-bold">Rp {transaksi.filter(t=>t.harga>0).reduce((a,b)=>a+(b.harga||0),0).toLocaleString()}</p></div></div>
          <div className="bg-zinc-900 p-3 rounded-xl">
            <p className="font-bold text-sm">User Real Yang Daftar (Supabase)</p>
            {users.length===0? <p className="text-xs text-zinc-500 mt-2">Belum ada user real. Kosong mergo TANPA DEMO.</p> : users.map(u=><div key={u.id} className="text-xs mt-2 bg-zinc-800 p-2 rounded flex justify-between"><span>{u.name||u.username} - {u.email}</span><span>Rp {u.saldo}</span></div>)}
          </div>
          <button onClick={()=>{setView('radar'); fetchReal()}} className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold">Lihat Radar REAL</button>
          <button onClick={()=>{localStorage.clear(); location.reload()}} className="w-full text-xs text-zinc-500">Log Out</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-black text-white pb-24">
      <div className="p-4 flex justify-between border-b border-zinc-900"><div><h1 className="font-black">TemanDekat</h1><p className="text-[10px] text-zinc-400">Rp {saldo.toLocaleString()} • REAL Supabase • Tanpa Demo</p></div><div className="text-xs bg-zinc-800 px-2 py-1 rounded-full">{user.name} {role==='OWNER'&&'👑'}</div></div>

      <div className="m-4 bg-white text-black p-3 rounded-2xl flex gap-3">
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">A</div>
        <div className="flex-1"><p className="text-xs font-bold">Asisten TemanDekat</p><p className="text-xs mt-1">{asistenTexts[asistenStep]}</p><div className="flex gap-2 mt-2"><button onClick={()=>setAsistenStep(s=> (s+1)%asistenTexts.length)} className="bg-black text-white px-3 py-1 rounded-full text-[10px]">Next Panduan</button><button onClick={()=>{navigator.geolocation?.getCurrentPosition(()=>{setAsistenStep(1); fetchReal()})}} className="bg-zinc-200 px-3 py-1 rounded-full text-[10px]">Aktifkan GPS & Reload REAL</button></div></div>
      </div>

      {view==='radar' && (
        <div className="p-4">
          <div className="bg-zinc-900 rounded-2xl p-4">
            <p className="font-bold text-sm">Radar Maksimal - REAL {users.length} User</p>
            <div className="w-48 h-48 mx-auto mt-4 relative"><div className="absolute inset-0 rounded-full border border-zinc-700"></div><div className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div><div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>{users.length===0 && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-zinc-500 text-center">Kosong<br/>Tunggu user real</p>}</div>
          </div>
          <div className="mt-4">
            {users.length===0? (
              <div className="bg-zinc-900 p-6 rounded-2xl text-center"><p className="text-sm font-bold">Belum ada wong cedak</p><p className="text-xs text-zinc-400 mt-1">Demo tak guwak. Saiki nunggu wong real daftar neng Supabase.</p><button onClick={()=>{const link=window.location.href; navigator.clipboard.writeText(link); alert('Link disalin! Share ke teman ben daftar REAL.')}} className="mt-3 bg-white text-black px-4 py-2 rounded-full text-xs font-bold">Undang Teman (+10k Real)</button></div>
            ) : users.filter(u=>u.email!==user.email).map(u=>(
              <div key={u.id} className="bg-zinc-900 p-3 rounded-xl flex justify-between items-center mt-2"><div><p className="text-sm font-bold">{u.name||u.username}</p><p className="text-xs text-zinc-400">{u.jarak||50}m • Rp {u.saldo} • REAL</p></div><button onClick={()=>{setTarget(u); alert('Chat REAL ke '+u.name+' - sambungke tabel chat')}} className="bg-white text-black px-3 py-1 rounded-full text-xs">Chat REAL</button></div>
            ))}
          </div>
        </div>
      )}

      {view==='dompet' && (
        <div className="p-4 space-y-4">
          <div className="bg-zinc-900 p-4 rounded-2xl"><p className="text-xs">Dompet Real Supabase</p><p className="text-2xl font-black">Rp {saldo.toLocaleString()}</p><p className="text-[10px] text-zinc-400 mt-1">SeaBank 9011**** • Midtrans REAL</p>
            <button onClick={()=>topupReal(20000)} className="w-full mt-3 bg-white text-black py-3 rounded-xl text-sm font-bold">Topup REAL 20rb</button>
            <button onClick={()=>topupReal(50000)} className="w-full mt-2 bg-zinc-800 py-3 rounded-xl text-sm">Topup REAL 50rb</button>
          </div>
          <div className="bg-zinc-900 p-3 rounded-xl"><p className="text-xs font-bold">Riwayat Transaksi REAL</p>{transaksi.map(t=><div key={t.id} className="text-xs mt-2 flex justify-between"><span>{t.jenis}</span><span>Rp {t.harga}</span></div>)}</div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-zinc-900 flex justify-around py-2 border-t border-zinc-800">
        <button onClick={()=>setView('radar')} className="text-xs">📡<br/>Radar</button>
        <button onClick={()=>setView('dompet')} className="text-xs">💰<br/>Dompet</button>
        <button onClick={()=>setView('owner')} className="text-xs">👤<br/>Profil</button>
      </div>
    </div>
  )
}
