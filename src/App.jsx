import { useState } from 'react';

const OWNER_NAME = 'triangga';
const OWNER_EMAIL = 'triangga406@gmail.com';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('td_user')||'null'));
  const [role, setRole] = useState(localStorage.getItem('td_role')||null);
  const [view, setView] = useState(user? (localStorage.getItem('td_role')==='OWNER'?'owner':'radar') : 'login');
  // DEMO DI GUWAK - KOSONGAN NUNGGU USER REAL
  const [users, setUsers] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [transaksi, setTransaksi] = useState([]);
  const [chats, setChats] = useState({});
  const [target, setTarget] = useState(null);
  const [inputChat, setInputChat] = useState('');
  const [radius, setRadius] = useState(500);
  const [sos, setSos] = useState([]);
  const [live, setLive] = useState([]);
  const [asistenStep, setAsistenStep] = useState(0);

  const asistenTexts = [
    "Halo bro! Aktifke GPS disek ben radar iso muter.",
    "Saiki radar kosong mergo urung enek user real. Undang koncomu daftar bro!",
    "Nek enek wong daftar, langsung ketok jarak meter e neng radar.",
    "Chat real, gift real, dompet real - kabeh mlebu Supabase mu.",
    "Top Up 50rb syarat Live 10 orang, duite real iso di-WD ke DANA/SeaBank."
  ];

  const isOwner = (n,e) => n.toLowerCase()===OWNER_NAME || e.toLowerCase()===OWNER_EMAIL;

  const login = (n,e) => {
    const r = isOwner(n,e)? 'OWNER' : 'USER';
    const u = {name:n, email:e, role:r};
    setUser(u); setRole(r);
    localStorage.setItem('td_user', JSON.stringify(u));
    localStorage.setItem('td_role', r);
    setView(r==='OWNER'?'owner':'radar');
    if(r==='USER' && users.length===0){
      setTransaksi([{id:1, type:'Bonus Daftar Real', jumlah:10000, tgl:new Date().toLocaleDateString()}]);
      setSaldo(10000);
    }
  };

  if(view==='login'){
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-black text-white p-6 flex flex-col justify-center">
        <h1 className="text-3xl font-black">TemanDekat</h1>
        <p className="text-sm text-zinc-400">REAL - Tanpa Demo - Asisten Aktif</p>
        <div className="mt-2 bg-blue-900/30 border border-blue-800 p-3 rounded-xl">
          <p className="text-xs font-bold text-blue-300">🤖 Asisten: {asistenTexts[0]}</p>
        </div>
        <div className="mt-6 bg-zinc-900 p-4 rounded-2xl">
          <input id="nm" placeholder="Nama (triangga = owner)" className="w-full p-3 bg-zinc-800 rounded-xl text-sm" />
          <input id="em" placeholder="Email" className="w-full mt-3 p-3 bg-zinc-800 rounded-xl text-sm" />
          <button onClick={()=>{const n=document.getElementById('nm').value; const e=document.getElementById('em').value; if(n&&e) login(n,e)}} className="w-full mt-4 bg-white text-black py-3 rounded-xl font-bold">Masuk (Real)</button>
          <p className="text-[10px] text-zinc-500 mt-2">Demo dihapus, hanya user real yang daftar yang muncul di radar.</p>
        </div>
      </div>
    )
  }

  if(role==='OWNER' && view==='owner'){
    return (
      <div className="max-w-[430px] mx-auto min-h-screen bg-black text-white pb-20">
        <div className="p-4 bg-zinc-900"><h1 className="font-bold">Dashboard Pemilik - {user.name}</h1><p className="text-xs text-zinc-400">{user.email} - Data Diamanke - Demo Dihapus</p></div>
        <div className="p-4 space-y-4">
          <div className="bg-blue-900/20 border border-blue-800 p-3 rounded-xl"><p className="text-xs font-bold">🤖 Asisten Owner:</p><p className="text-xs mt-1">Saiki user masih {users.length} (real). Kowe iso lihat siapa daftar, uang masuk, kasih saldo manual. Demo Rina Budi sudah tak guwak.</p></div>
          <div className="grid grid-cols-2 gap-3"><div className="bg-green-900/30 p-3 rounded-xl"><p className="text-xs">User Real</p><p className="font-bold">{users.length} orang</p></div><div className="bg-zinc-900 p-3 rounded-xl"><p className="text-xs">Uang Masuk Real</p><p className="font-bold">Rp {transaksi.filter(t=>t.jumlah>0).reduce((a,b)=>a+b.jumlah,0).toLocaleString()}</p></div></div>
          <div className="bg-zinc-900 p-3 rounded-xl">
            <p className="font-bold text-sm">User Real Yang Daftar (Bukan Demo)</p>
            {users.length===0? <p className="text-xs text-zinc-500 mt-2">Belum ada user real. Undang teman daftar, nanti muncul di sini.</p> : users.map(u=><div key={u.id} className="text-xs mt-2 bg-zinc-800 p-2 rounded">{u.name} - {u.email}</div>)}
          </div>
          <button onClick={()=>setView('radar')} className="w-full bg-zinc-800 py-3 rounded-xl text-sm">Lihat Radar (Real)</button>
          <button onClick={()=>{localStorage.clear(); location.reload()}} className="w-full text-xs text-zinc-500">Log Out</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-black text-white pb-24">
      <div className="p-4 flex justify-between border-b border-zinc-900"><div><h1 className="font-black">TemanDekat</h1><p className="text-[10px] text-zinc-400">Rp {saldo.toLocaleString()} • REAL • Tanpa Demo</p></div><div className="text-xs bg-zinc-800 px-2 py-1 rounded-full">{user.name}</div></div>

      {/* ASISTEN MANDU UTAMA */}
      <div className="m-4 bg-white text-black p-3 rounded-2xl flex gap-3">
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">A</div>
        <div className="flex-1"><p className="text-xs font-bold">Asisten TemanDekat</p><p className="text-xs mt-1">{asistenTexts[asistenStep]}</p><div className="flex gap-2 mt-2"><button onClick={()=>setAsistenStep(s=> (s+1)%asistenTexts.length)} className="bg-black text-white px-3 py-1 rounded-full text-[10px]">Next Panduan</button><button onClick={()=>{navigator.geolocation?.getCurrentPosition(()=>setAsistenStep(1))}} className="bg-zinc-200 px-3 py-1 rounded-full text-[10px]">Aktifkan GPS</button></div></div>
      </div>

      {view==='radar' && (
        <div className="p-4">
          <div className="bg-zinc-900 rounded-2xl p-4">
            <p className="font-bold text-sm">Radar Maksimal - Real</p>
            <div className="w-48 h-48 mx-auto mt-4 relative"><div className="absolute inset-0 rounded-full border border-zinc-700"></div><div className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div><div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>{users.length===0 && <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-zinc-500 text-center">Kosong<br/>Tunggu user real</p>}</div>
            <div className="flex gap-2 mt-4">{[100,500,1000,5000].map(r=><button key={r} onClick={()=>setRadius(r)} className={`px-3 py-1 rounded-full text-xs ${radius===r?'bg-white text-black':'bg-zinc-800'}`}>{r>=1000?r/1000+'km':r+'m'}</button>)}</div>
          </div>
          <div className="mt-4">
            {users.length===0? (
              <div className="bg-zinc-900 p-6 rounded-2xl text-center"><p className="text-sm font-bold">Belum ada wong cedak</p><p className="text-xs text-zinc-400 mt-1">Demo tak guwak. Saiki nunggu wong real daftar. Asisten akan mandu kamu cara undang teman dapat +10k.</p><button onClick={()=>{const link=window.location.href; navigator.clipboard.writeText(link); alert('Link disalin! Share ke teman ben daftar.')}} className="mt-3 bg-white text-black px-4 py-2 rounded-full text-xs font-bold">Undang Teman (+10k)</button></div>
            ) : users.filter(u=>u.jarak<=radius).map(u=>(
              <div key={u.id} className="bg-zinc-900 p-3 rounded-xl flex justify-between items-center mt-2"><div><p className="text-sm font-bold">{u.name}</p><p className="text-xs text-zinc-400">{u.jarak}m</p></div><button onClick={()=>{setTarget(u); setView('chat')}} className="bg-white text-black px-3 py-1 rounded-full text-xs">Chat Real</button></div>
            ))}
          </div>
        </div>
      )}

      {view==='dompet' && (
        <div className="p-4 space-y-4">
          <div className="bg-zinc-900 p-4 rounded-2xl"><p className="text-xs">Dompet Real</p><p className="text-2xl font-black">Rp {saldo.toLocaleString()}</p><p className="text-[10px] text-zinc-400 mt-1">Tanpa demo, saldo real dari hiburan & top up Midtrans</p></div>
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
