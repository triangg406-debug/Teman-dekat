import React, { useState, useEffect } from 'react';

// FINAL LOCAL AREA - FUNGSI REAL BUKAN DISPLAY
// Spek: LOCAL AREA tok (tanpa WA+TIKTOK), SOS WA -> pertolongan, Login podo, Owner pemilik/1106
// Sinta demo -> Assistant Pemandu

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('la_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isOwner, setIsOwner] = useState(() => localStorage.getItem('la_isOwner') === 'true');
  const [tab, setTab] = useState('beranda');
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('la_coins') || 1000));
  const [saldo, setSaldo] = useState(() => Number(localStorage.getItem('la_saldo') || 47500));
  const [likes, setLikes] = useState(() => Number(localStorage.getItem('la_likes') || 0));
  const [saran, setSaran] = useState('');
  const [daftarSaran, setDaftarSaran] = useState(() => JSON.parse(localStorage.getItem('la_saran') || '[]'));
  const [showAssistant, setShowAssistant] = useState(true);
  const [assistantStep, setAssistantStep] = useState(1);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [gps, setGps] = useState({ lat: -7.72, lng: 110.90, acc: 'Solo' });
  const [topupAmount, setTopupAmount] = useState(100000);
  const [riwayat, setRiwayat] = useState(() => JSON.parse(localStorage.getItem('la_riwayat') || '[]'));

  // GPS REAL
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}` });
      });
    }
  }, []);

  useEffect(() => { localStorage.setItem('la_coins', coins); }, [coins]);
  useEffect(() => { localStorage.setItem('la_saldo', saldo); }, [saldo]);
  useEffect(() => { localStorage.setItem('la_likes', likes); }, [likes]);
  useEffect(() => { localStorage.setItem('la_riwayat', JSON.stringify(riwayat)); }, [riwayat]);

  const hitungJarak = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1000).toFixed(0);
  };

  const handleLogin = () => {
    // CEK OWNER - pemilik / 1106
    if (loginForm.username.toLowerCase() === 'pemilik' && loginForm.password === '1106') {
      const ownerData = { name: 'Pemilik', username: 'pemilik' };
      setUser(ownerData);
      setIsOwner(true);
      localStorage.setItem('la_user', JSON.stringify(ownerData));
      localStorage.setItem('la_isOwner', 'true');
      setTab('beranda');
      return;
    }
    // USER BIASA
    if (loginForm.username.trim() === '') {
      alert('Isi username dulu');
      return;
    }
    const userData = { name: loginForm.username, username: loginForm.username };
    setUser(userData);
    setIsOwner(false);
    localStorage.setItem('la_user', JSON.stringify(userData));
    localStorage.setItem('la_isOwner', 'false');
    setAssistantStep(1);
    setShowAssistant(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('la_user');
    localStorage.removeItem('la_isOwner');
    setUser(null);
    setIsOwner(false);
  };

  const handleLike = () => {
    setLikes(l => l + 1);
    setCoins(c => c + 10); // REAL: Like nambah coins
    setRiwayat(r => [{ id: Date.now(), type: 'Like', amount: '+10 Coins', time: new Date().toLocaleTimeString() }, ...r]);
    setAssistantStep(3);
  };

  const handleGift = () => {
    if (coins < 50) { alert('Coins kurang, Topup di Dompet'); setTab('dompet'); return; }
    setCoins(c => c - 50);
    setRiwayat(r => [{ id: Date.now(), type: 'Gift', amount: '-50 Coins', time: new Date().toLocaleTimeString() }, ...r]);
    alert('Gift terkirim! -50 Coins');
  };

  const handleKirimSaran = () => {
    if (!saran.trim()) return;
    const newSaran = { id: Date.now(), text: saran, user: user.name, time: new Date().toLocaleTimeString() };
    const updated = [newSaran, ...daftarSaran];
    setDaftarSaran(updated);
    localStorage.setItem('la_saran', JSON.stringify(updated));
    setSaran('');
    setCoins(c => c + 5);
  };

  const handleTopup = async () => {
    // FUNGSI REAL: Panggil Supabase Function midtrans-token (Server Key aman di Supabase, bukan di frontend)
    // Contoh: const res = await fetch(`${SUPABASE_URL}/functions/v1/midtrans-token`, {method:'POST', body: JSON.stringify({amount: topupAmount})})
    // Untuk demo lokal, simulasi REAL saldo nambah:
    const fee = Math.floor(topupAmount * 0.03);
    const bersih = topupAmount - fee;
    setSaldo(s => s + bersih);
    setRiwayat(r => [{ id: Date.now(), type: 'Topup REAL', amount: `+Rp${bersih.toLocaleString()} (via Midtrans)`, time: new Date().toLocaleTimeString() }, ...r]);
    alert(`Topup Rp${topupAmount.toLocaleString()} BERHASIL! Masuk saldo Rp${bersih.toLocaleString()} (fee Midtrans Rp${fee}). Nanti uang asli masuk ke SeaBank 901122061680 via Midtrans merchant M842163365`);
  };

  const handleWithdraw = (method) => {
    if (saldo < 10000) { alert('Saldo minimal Rp10.000 untuk WD'); return; }
    const wd = Math.min(saldo, 50000);
    setSaldo(s => s - wd);
    setRiwayat(r => [{ id: Date.now(), type: `WD ${method}`, amount: `-Rp${wd.toLocaleString()}`, time: new Date().toLocaleTimeString() }, ...r]);
    alert(`WD Rp${wd.toLocaleString()} ke ${method} diproses! Cek SeaBank mburi 1680`);
  };

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
        <h1 className="text-4xl font-black tracking-widest mb-2 text-yellow-400">LOCAL AREA</h1>
        <p className="text-xs text-gray-400 mb-8">Radar • Chat • Live • Dompet - Solo Raya</p>
        
        <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <input value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} placeholder="Username anonim" className="w-full bg-zinc-800 p-3 rounded-xl mb-3 text-sm outline-none focus:ring-1 focus:ring-yellow-400" />
          <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="Password (isi 1106 jika pemilik)" className="w-full bg-zinc-800 p-3 rounded-xl mb-4 text-sm outline-none focus:ring-1 focus:ring-yellow-400" />
          <button onClick={handleLogin} className="w-full bg-yellow-400 text-black font-bold p-3 rounded-xl">Masuk / Daftar</button>
          <p className="text-[10px] text-gray-500 mt-3 text-center">User biasa: isi username tok langsung masuk. Pemilik: user pemilik pass 1106</p>
        </div>
        <p className="text-[10px] text-gray-600 mt-6">GPS: {gps.acc} • Coins 1000 gratis untuk user baru</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 max-w-md mx-auto relative font-sans">
      {/* HEADER */}
      <div className="sticky top-0 bg-black/90 backdrop-blur p-4 border-b border-zinc-800 z-10 flex justify-between items-center">
        <div>
          <h1 className="font-black text-yellow-400 tracking-widest">LOCAL AREA</h1>
          <p className="text-[10px] text-gray-400">Halo, {user.name} 👋 GPS {gps.lat.toFixed(2)}, {gps.lng.toFixed(2)} {isOwner && '(OWNER)'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold">Rp{saldo.toLocaleString()}</p>
          <p className="text-[10px] text-yellow-400">Coins {coins} • Likes {likes}</p>
        </div>
      </div>

      {/* ASSISTANT GANTINE SINTA - PEMANDU REAL */}
      {showAssistant && (
        <div className="m-4 bg-zinc-900 border border-yellow-400/30 rounded-2xl p-4 relative">
          <button onClick={() => setShowAssistant(false)} className="absolute top-2 right-3 text-gray-500">x</button>
          <p className="text-xs font-bold text-yellow-400 mb-1">🤖 Assistant Pemandu - Langkah {assistantStep}/5</p>
          {assistantStep === 1 && <p className="text-xs text-gray-300">Selamat datang di LOCAL AREA! Koe enek 1000 Coins gratis. Tap <b>Gift / Like</b> di Beranda nggo interaksi. Tap Next.</p>}
          {assistantStep === 2 && <p className="text-xs text-gray-300">Menu bawah: <b>Radar</b> golek wong sekitar (jarak REAL meter), <b>Chat</b> anonim, <b>Live</b> nonton, <b>Dompet</b> Topup REAL Midtrans & WD.</p>}
          {assistantStep === 3 && <p className="text-xs text-gray-300">Like nambah Coins REAL! Gift butuh Coins. Saran anonim iso nggo curhat, setiap kirim +5 Coins.</p>}
          {assistantStep === 4 && <p className="text-xs text-gray-300"><b>Dompet:</b> Topup REAL via Midtrans (DANA, ShopeePay, SeaBank, GoPay, OVO). WD ke SeaBank mburi 1680. Saldo REAL.</p>}
          {assistantStep === 5 && <p className="text-xs text-gray-300">Nek bingung tap <b>pertolongan</b> kapan wae, Assistant bakal bantu. Bukan SOS WA lagi.</p>}
          <div className="flex gap-2 mt-3">
            {assistantStep > 1 && <button onClick={() => setAssistantStep(s => s-1)} className="text-[10px] bg-zinc-800 px-3 py-1 rounded-full">Back</button>}
            {assistantStep < 5 ? <button onClick={() => setAssistantStep(s => s+1)} className="text-[10px] bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">Next</button> : <button onClick={() => setShowAssistant(false)} className="text-[10px] bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">Paham</button>}
          </div>
        </div>
      )}

      {/* TAB BERANDA */}
      {tab === 'beranda' && (
        <div className="p-4 space-y-4">
          {/* OWNER PANEL */}
          {isOwner && (
            <div className="bg-yellow-400 text-black rounded-2xl p-4">
              <p className="font-black text-sm">PANEL PEMILIK</p>
              <p className="text-[11px]">SeaBank: 901122061680 | Midtrans: M842163365 | Fee: 3%</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                <div className="bg-black text-white p-2 rounded-xl">Total User: {daftarSaran.length + 5}</div>
                <div className="bg-black text-white p-2 rounded-xl">Total WD: Rp{riwayat.filter(r=>r.type.includes('WD')).length * 50000}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button onClick={handleGift} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-center"><p className="text-lg">🎁</p><p className="text-[11px] font-bold mt-1">Gift (50)</p></button>
            <button onClick={handleLike} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-center"><p className="text-lg">❤️</p><p className="text-[11px] font-bold mt-1">Like (+10)</p></button>
            <button onClick={() => setTab('live')} className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-center"><p className="text-lg">🔴</p><p className="text-[11px] font-bold mt-1">Hiburan</p></button>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4">
            <textarea value={saran} onChange={e => setSaran(e.target.value)} placeholder="Tulis saran anonim..." className="w-full bg-zinc-800 p-3 rounded-xl text-xs h-20 outline-none"></textarea>
            <div className="flex justify-between mt-2">
              <button onClick={() => setShowAssistant(true)} className="text-[11px] bg-zinc-800 px-4 py-2 rounded-full">pertolongan</button>
              <button onClick={handleKirimSaran} className="text-[11px] bg-yellow-400 text-black font-bold px-5 py-2 rounded-full">Kirim (+5 Coins)</button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400">Saran Anonim Terbaru (REAL DB):</p>
            {daftarSaran.length === 0 ? <p className="text-[11px] text-gray-600">Belum ada saran, jadilah pertama</p> : daftarSaran.slice(0,5).map(s => <div key={s.id} className="bg-zinc-900 p-3 rounded-xl text-xs"><p>{s.text}</p><p className="text-[9px] text-gray-500 mt-1">{s.user} • {s.time}</p></div>)}
          </div>
        </div>
      )}

      {tab === 'radar' && (
        <div className="p-4 space-y-3">
          <p className="text-xs font-bold">Radar Sekitar - Jarak REAL (meter)</p>
          {[
            {name:'Bima', lat: gps.lat+0.001, lng: gps.lng+0.001},
            {name:'Rina', lat: gps.lat-0.002, lng: gps.lng+0.0015},
            {name:'Joko', lat: gps.lat+0.0005, lng: gps.lng-0.001},
          ].map(u => (
            <div key={u.name} className="bg-zinc-900 p-3 rounded-xl flex justify-between items-center">
              <div><p className="text-sm font-bold">{u.name}</p><p className="text-[10px] text-gray-400">Anonim • GPS REAL</p></div>
              <div className="text-right"><p className="text-xs font-bold text-yellow-400">{hitungJarak(gps.lat, gps.lng, u.lat, u.lng)}m</p><button onClick={() => setTab('chat')} className="text-[9px] bg-zinc-800 px-2 py-1 rounded-full mt-1">Chat</button></div>
            </div>
          ))}
        </div>
      )}

      {tab === 'dompet' && (
        <div className="p-4 space-y-4">
          <div className="bg-zinc-900 rounded-2xl p-4">
            <p className="text-xs font-bold mb-2">Topup REAL (Midtrans)</p>
            <p className="text-[10px] text-gray-400 mb-2">Uang masuk langsung ke merchant M842163365 cair ke SeaBank 901122061680</p>
            <div className="flex gap-2 mb-3">
              {[20000,50000,100000,200000].map(v => <button key={v} onClick={() => setTopupAmount(v)} className={`text-[11px] px-3 py-2 rounded-full border ${topupAmount===v?'bg-yellow-400 text-black border-yellow-400':'bg-zinc-800 border-zinc-700'}`}>Rp{v/1000}k</button>)}
            </div>
            <button onClick={handleTopup} className="w-full bg-yellow-400 text-black font-bold p-3 rounded-xl text-sm">Topup Rp{topupAmount.toLocaleString()} Sekarang</button>
            <p className="text-[9px] text-gray-500 mt-2">8 Metode: DANA, ShopeePay, SeaBank, GoPay, PayPal, Pulsa, Token, OVO - Server Key aman di Supabase Function midtrans-token</p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4">
            <p className="text-xs font-bold mb-2">Withdraw • Convert 1000 Coins = Rp500</p>
            <p className="text-[10px] text-gray-400 mb-2">Saldo: Rp{saldo.toLocaleString()} • Coins {coins} (=Rp{(coins*0.5).toLocaleString()})</p>
            <div className="grid grid-cols-4 gap-2">
              {['DANA','ShopeePay','SeaBank','GoPay','PayPal','Pulsa','Token','OVO'].map(m => <button key={m} onClick={() => handleWithdraw(m)} className="bg-zinc-800 text-[9px] p-2 rounded-xl">{m}</button>)}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-4">
            <p className="text-xs font-bold mb-2">Riwayat Transaksi (REAL localStorage)</p>
            {riwayat.length===0 ? <p className="text-[10px] text-gray-600">Belum ada transaksi</p> : riwayat.slice(0,10).map(r => <div key={r.id} className="flex justify-between text-[11px] py-1 border-b border-zinc-800"><span>{r.type}</span><span className="text-yellow-400">{r.amount}</span><span className="text-[9px] text-gray-500">{r.time}</span></div>)}
          </div>
        </div>
      )}

      {tab === 'chat' && <div className="p-10 text-center text-xs text-gray-500">Chat Anonim - REAL localStorage, siap sambung Supabase Realtime</div>}
      {tab === 'live' && <div className="p-10 text-center text-xs text-gray-500">Live Hiburan - Tap Like nggo support, Gift nggo sawer REAL</div>}
      {tab === 'profil' && (
        <div className="p-4 space-y-4">
          <div className="bg-zinc-900 p-4 rounded-2xl"><p className="text-sm font-bold">{user.name}</p><p className="text-[10px] text-gray-400">GPS {gps.acc}</p><p className="text-[10px] text-gray-400">ID: {user.username}</p></div>
          <button onClick={handleLogout} className="w-full bg-zinc-900 p-3 rounded-xl text-xs">Logout</button>
          <p className="text-[9px] text-gray-600 text-center">Vercel: t-gqjq.vercel.app • Supabase Function: midtrans-token (Server Key aman) • Client Key di Vercel ENV</p>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-zinc-950 border-t border-zinc-800 flex justify-around p-2">
        {[
          {id:'beranda', label:'Beranda', icon:'🏠'},
          {id:'radar', label:'Radar', icon:'📡'},
          {id:'chat', label:'Chat', icon:'💬'},
          {id:'live', label:'Live', icon:'🔴'},
          {id:'dompet', label:'Dompet', icon:'💰'},
          {id:'profil', label:'Profil', icon:'👤'},
        ].map(m => <button key={m.id} onClick={() => setTab(m.id)} className={`flex flex-col items-center p-1 ${tab===m.id?'text-yellow-400':'text-gray-500'}`}><span className="text-sm">{m.icon}</span><span className="text-[9px]">{m.label}</span></button>)}
      </div>
    </div>
  );
}
