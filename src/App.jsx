// FINAL APK.JSX - LOCAL AREA - FINAL TENAN V3
// Tampilan utama: Daftar konfirmasi WA atau Email, baru Log In
// RA ENEK DEMO - Demo diganti Asisten Owner
// PIN Dewa 1106 - Tap logo 5x
import React, { useState } from 'react';

export default function FinalAPK() {
  const [step, setStep] = useState('daftar'); // daftar | konfirmasi | login | app
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  
  // FORM DAFTAR
  const [formDaftar, setFormDaftar] = useState({ nama: '', kontak: '', tipe: 'WA', password: '' });
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  // DATA REAL - RA ENEK DEMO
  const [usersReal, setUsersReal] = useState([]); // 0 orang awal
  const [uangMasuk, setUangMasuk] = useState(0);
  const [transaksi, setTransaksi] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  // FORM LOGIN
  const [formLogin, setFormLogin] = useState({ kontak: '', password: '' });

  const handleLogoTap = () => {
    const n = tapCount + 1; setTapCount(n);
    if (n >= 5) { setShowPin(true); setTapCount(0); }
    setTimeout(()=>setTapCount(0),3000);
  };
  const handlePin = () => {
    if (pin==='1106') {
      setIsOwner(true);
      setUser({name:'triangga', kontak:'owner', isOwner:true});
      setStep('app'); setShowPin(false); setPin('');
    } else alert('PIN Salah!');
  };

  // DAFTAR -> KIRIM KONFIRMASI WA/EMAIL
  const handleDaftar = () => {
    if (!formDaftar.nama || !formDaftar.kontak || !formDaftar.password) return alert('Lengkapi daftar!');
    // Cek sudah ada?
    if (usersReal.find(u=>u.kontak===formDaftar.kontak)) return alert('WA/Email wes terdaftar!');
    // Generate OTP simulasi
    const kode = Math.floor(100000 + Math.random()*900000).toString();
    setOtp(kode);
    setPendingUser({ ...formDaftar, id: Date.now(), saldo: 0, online: true, daftar: new Date().toLocaleString() });
    setStep('konfirmasi');
    alert(`KODE KONFIRMASI ${formDaftar.tipe} ke ${formDaftar.kontak}: ${kode} (simulasi - di real kirim via WA/Email)`);
  };

  const handleKonfirmasi = () => {
    if (otpInput !== otp) return alert('Kode konfirmasi salah!');
    // Sukses daftar
    setUsersReal([...usersReal, { ...pendingUser, verified: true }]);
    alert(`Sukses! Akun ${pendingUser.nama} terverifikasi. Saiki iso Log In`);
    setStep('login');
    setFormLogin({ kontak: pendingUser.kontak, password: pendingUser.password });
    setOtpInput(''); setOtp(''); setPendingUser(null);
  };

  const handleLogin = () => {
    const found = usersReal.find(u=>u.kontak===formLogin.kontak && u.password===formLogin.password);
    if (!found) {
      if (formLogin.kontak==='triangga' && formLogin.password==='1106') {
        // Owner bisa login langsung juga
        setIsOwner(true); setUser({name:'triangga', isOwner:true}); setStep('app'); return;
      }
      return alert('WA/Email atau password salah, atau belum konfirmasi!');
    }
    setUser(found);
    setIsOwner(false);
    setStep('app');
  };

  // FUNGSI DEWA
  const kasihGift = (target, nominal) => {
    setUsersReal(usersReal.map(u=>u.nama===target?{...u, saldo:u.saldo+Number(nominal)}:u));
  };
  const tarikDuit = (nominal, metode) => {
    if (Number(nominal) > uangMasuk) return alert('Uang real kurang! Rp '+uangMasuk);
    setUangMasuk(uangMasuk-Number(nominal));
    alert(`Narik Rp ${nominal} ke ${metode} sukses!`);
  };
  const tfUser = (dari, ke, nominal) => {
    setUsersReal(usersReal.map(u=>{
      if(u.nama===dari) return {...u, saldo:u.saldo-Number(nominal)};
      if(u.nama===ke) return {...u, saldo:u.saldo+Number(nominal)};
      return u;
    }));
  };

  // STEP 1: DAFTAR - TAMPILAN UTAMA
  if (step==='daftar') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div onClick={handleLogoTap} className="text-5xl mb-3 cursor-pointer select-none">📍</div>
        <h1 className="font-bold text-xl">LOCAL AREA</h1>
        <p className="text-[11px] text-zinc-500 mb-6">Daftar dulu - Konfirmasi WA/Email - Baru Login • Ra enek demo</p>
        
        <div className="w-full max-w-xs bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
          <h2 className="font-bold mb-4">Daftar Akun Real</h2>
          <input value={formDaftar.nama} onChange={e=>setFormDaftar({...formDaftar, nama:e.target.value})} placeholder="Jeneng lengkap" className="w-full bg-black p-3 rounded-xl border border-zinc-800 mb-2 text-sm"/>
          
          <div className="flex gap-2 mb-2">
            <select value={formDaftar.tipe} onChange={e=>setFormDaftar({...formDaftar, tipe:e.target.value})} className="bg-black p-3 rounded-xl border border-zinc-800 text-sm">
              <option value="WA">WA</option>
              <option value="Email">Email</option>
            </select>
            <input value={formDaftar.kontak} onChange={e=>setFormDaftar({...formDaftar, kontak:e.target.value})} placeholder={formDaftar.tipe==='WA'?'Nomor WA (628...)':'Email'} className="flex-1 bg-black p-3 rounded-xl border border-zinc-800 text-sm"/>
          </div>
          
          <input type="password" value={formDaftar.password} onChange={e=>setFormDaftar({...formDaftar, password:e.target.value})} placeholder="Password" className="w-full bg-black p-3 rounded-xl border border-zinc-800 mb-4 text-sm"/>
          
          <button onClick={handleDaftar} className="w-full bg-yellow-400 text-black font-bold p-3 rounded-xl">DAFTAR & KIRIM KONFIRMASI</button>
          <button onClick={()=>setStep('login')} className="w-full mt-3 text-zinc-400 text-xs">Wes punya akun? Log In</button>
        </div>

        <p className="text-[10px] text-zinc-600 mt-4 text-center">Demo diganti Asisten • WA+TIKTOK ilang • SOS jadi Pertolongan</p>

        {showPin && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-xs border border-yellow-400">
              <h3 className="font-bold mb-3">PIN DEWA 1106</h3>
              <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="1106" className="w-full bg-black p-3 rounded-xl border border-zinc-700 mb-3"/>
              <button onClick={handlePin} className="w-full bg-yellow-400 text-black font-bold p-3 rounded-xl">BUKA</button>
              <button onClick={()=>setShowPin(false)} className="w-full mt-2 text-zinc-500 text-sm">Batal</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STEP 2: KONFIRMASI WA/EMAIL
  if (step==='konfirmasi') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="font-bold text-xl mb-2">Konfirmasi {formDaftar.tipe}</h1>
        <p className="text-xs text-zinc-400 mb-6 text-center">Kode dikirim ke {pendingUser?.kontak}<br/>Cek WA/Email mu (simulasi: {otp})</p>
        <div className="w-full max-w-xs bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
          <input value={otpInput} onChange={e=>setOtpInput(e.target.value)} placeholder="Masukkan 6 digit kode" className="w-full bg-black p-3 rounded-xl border border-zinc-800 mb-4 text-center text-lg tracking-widest"/>
          <button onClick={handleKonfirmasi} className="w-full bg-yellow-400 text-black font-bold p-3 rounded-xl">KONFIRMASI & AKTIFKAN</button>
          <button onClick={()=>setStep('daftar')} className="w-full mt-3 text-zinc-500 text-xs">Ganti WA/Email</button>
        </div>
      </div>
    );
  }

  // STEP 3: LOG IN
  if (step==='login') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div onClick={handleLogoTap} className="text-5xl mb-3 cursor-pointer">📍</div>
        <h1 className="font-bold text-xl mb-6">Log In Real</h1>
        <div className="w-full max-w-xs bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
          <input value={formLogin.kontak} onChange={e=>setFormLogin({...formLogin, kontak:e.target.value})} placeholder="WA / Email yang sudah konfirmasi" className="w-full bg-black p-3 rounded-xl border border-zinc-800 mb-2 text-sm"/>
          <input type="password" value={formLogin.password} onChange={e=>setFormLogin({...formLogin, password:e.target.value})} placeholder="Password" className="w-full bg-black p-3 rounded-xl border border-zinc-800 mb-4 text-sm"/>
          <button onClick={handleLogin} className="w-full bg-yellow-400 text-black font-bold p-3 rounded-xl">LOG IN</button>
          <button onClick={()=>setStep('daftar')} className="w-full mt-3 text-zinc-400 text-xs">Durung daftar? Daftar sek</button>
        </div>
        {showPin && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-xs border border-yellow-400">
              <h3 className="font-bold mb-3">PIN DEWA</h3>
              <input type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="1106" className="w-full bg-black p-3 rounded-xl border border-zinc-700 mb-3"/>
              <button onClick={handlePin} className="w-full bg-yellow-400 text-black font-bold p-3 rounded-xl">BUKA DEWA</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STEP 4: APP UTAMA - OWNER DEWA
  if (isOwner) {
    return (
      <div className="min-h-screen bg-[#050507] text-white">
        <div className="bg-zinc-900 p-4 border-b border-yellow-400/20 sticky top-0">
          <h1 className="font-bold text-yellow-400">Dashboard Pemilik - triangga - DEWA</h1>
          <p className="text-xs text-zinc-400">1106 - Data Diamanke - Demo Dihapus, Diganti Asisten</p>
          <div className="mt-3 bg-[#0a1628] border border-blue-500/40 p-3 rounded-xl">
            <p className="text-sm font-bold">🤖 Asisten Owner:</p>
            <p className="text-xs text-zinc-300 mt-1">Saiki user masih {usersReal.length} (real). Kowe iso lihat siapa daftar, uang masuk, kasih saldo manual. {usersReal.length===0?'Demo Rina Budi sudah tak guwak.':'Ada '+usersReal.length+' user real.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-[#1B2A1E] p-3 rounded-xl"><p className="text-xs text-zinc-400">User Real</p><p className="font-bold">{usersReal.length} orang</p></div>
            <div className="bg-[#1B2A1E] p-3 rounded-xl"><p className="text-xs text-zinc-400">Uang Masuk Real</p><p className="font-bold">Rp {uangMasuk.toLocaleString()}</p></div>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            <button onClick={()=>setActiveTab('users')} className={`px-3 py-2 rounded-full text-xs font-bold ${activeTab==='users'?'bg-yellow-400 text-black':'bg-zinc-800'}`}>USER REAL</button>
            <button onClick={()=>setActiveTab('duit')} className={`px-3 py-2 rounded-full text-xs font-bold ${activeTab==='duit'?'bg-yellow-400 text-black':'bg-zinc-800'}`}>DUIT & SALDO</button>
            <button onClick={()=>setActiveTab('chat')} className={`px-3 py-2 rounded-full text-xs font-bold ${activeTab==='chat'?'bg-yellow-400 text-black':'bg-zinc-800'}`}>CHAT SPO WAE</button>
            <button onClick={()=>setActiveTab('setting')} className={`px-3 py-2 rounded-full text-xs font-bold ${activeTab==='setting'?'bg-yellow-400 text-black':'bg-zinc-800'}`}>SETTING</button>
          </div>
        </div>
        <div className="p-4">
          {activeTab==='users' && (
            <div>
              <h2 className="font-bold mb-2 text-sm">User Real Yang Daftar (Bukan Demo)</h2>
              {usersReal.length===0 ? <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center"><p className="text-sm text-zinc-500">Belum ada user real. Undang teman daftar, nanti muncul di sini.</p></div> :
                usersReal.map(u=><div key={u.id} className="bg-zinc-900 p-3 rounded-xl mb-2 flex justify-between border border-zinc-800"><div><p className="font-bold text-sm">{u.nama}</p><p className="text-[11px] text-zinc-400">{u.kontak} • Rp {u.saldo.toLocaleString()}</p></div><div className="flex gap-1"><button onClick={()=>{const n=prompt('Gift ke '+u.nama); if(n) kasihGift(u.nama,n)}} className="bg-green-600 text-[10px] px-2 py-1 rounded">GIFT</button><button onClick={()=>{const d=prompt('TF format: tujuan,nominal'); if(d){const[ke,j]=d.split(','); tfUser(u.nama,ke.trim(),j.trim())}}} className="bg-blue-600 text-[10px] px-2 py-1 rounded">TF</button></div></div>)
              }
              <button onClick={()=>{setStep('daftar'); setIsOwner(false); setUser(null)}} className="w-full mt-4 text-zinc-500 text-sm">Log Out</button>
            </div>
          )}
          {activeTab==='duit' && <div className="space-y-3"><button onClick={()=>{const n=prompt('Narik berapa?'); const m=prompt('Ke DANA/BCA?'); if(n) tarikDuit(n,m)}} className="w-full bg-yellow-400 text-black p-3 rounded-xl font-bold text-sm">NARIK DUIT DEWA - Rp {uangMasuk.toLocaleString()}</button></div>}
          {activeTab==='chat' && <div className="bg-zinc-900 p-4 rounded-xl"><p className="text-xs mb-2">Iso chat spo wae - broadcast ke {usersReal.length} user real</p><button onClick={()=>alert('Broadcast ke semua')} className="w-full bg-yellow-400 text-black p-2 rounded text-sm font-bold">BROADCAST</button></div>}
          {activeTab==='setting' && <div className="text-xs space-y-1"><p>✅ Daftar Konfirmasi WA/Email - aktif</p><p>✅ Login Real - aktif</p><p>✅ Ra enek demo - diganti asisten</p><p>✅ Dewa iso TF, Gift, Tarik, Chat</p></div>}
        </div>
      </div>
    );
  }

  // USER BIASA APP
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h2 className="font-bold">📡 Radar - {user?.nama}</h2>
      <p className="text-xs text-zinc-500">User real: {usersReal.length} • Ra enek demo</p>
      <div className="mt-4 bg-zinc-900 p-3 rounded-xl"><p className="text-xs font-bold text-yellow-400">JALUR DUIT REAL</p><p className="text-sm">Saldo mu: Rp {usersReal.find(u=>u.nama===user?.nama)?.saldo.toLocaleString() || 0}</p></div>
      <button onClick={()=>{setStep('daftar'); setUser(null)}} className="w-full mt-6 text-zinc-500 text-sm">Log Out</button>
    </div>
  );
}
