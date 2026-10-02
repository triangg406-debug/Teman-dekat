import { useState, useEffect } from "react";

const seaBankNo = "9013xxxxxxxx"; 
const seaBankName = "TRI ANGGA";

const users = [
  { id: 1, name: "Sari, 21", jarak: "200m", bio: "Ngopi santai", wa: "6281234567890" },
  { id: 2, name: "Bima, 23", jarak: "450m", bio: "Gym & futsal", wa: "6281234567891" },
  { id: 3, name: "Riko, 22", jarak: "1.2km", bio: "Ngoding", wa: "6281234567892" },
  { id: 4, name: "Ayu, 20", jarak: "800m", bio: "Mahasiswa", wa: "6281234567893" },
];

export default function App() {
  const [saldo, setSaldo] = useState(() => Number(localStorage.getItem("td_saldo") || 5000));
  const [cuan, setCuan] = useState(() => Number(localStorage.getItem("td_cuan") || 0));
  const [seaBank, setSeaBank] = useState(() => Number(localStorage.getItem("td_seabank") || 5000000));
  const [isAdminFree, setIsAdminFree] = useState(() => localStorage.getItem("td_admin_free") === "true");
  const [showTopup, setShowTopup] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("5000000");

  useEffect(() => localStorage.setItem("td_saldo", saldo), [saldo]);
  useEffect(() => localStorage.setItem("td_cuan", cuan), [cuan]);
  useEffect(() => localStorage.setItem("td_seabank", seaBank), [seaBank]);
  useEffect(() => localStorage.setItem("td_admin_free", isAdminFree), [isAdminFree]);

  const handleSapa = (u) => {
    // KHUSUS OWNER = GRATIS, TETAP DAPAT CUAN
    if (!isAdminFree && saldo < 1000) {
      alert("Saldo habis, topup dulu!");
      setShowTopup(true);
      return;
    }
    
    if (!isAdminFree) {
      setSaldo(s => s - 1000);
    }
    // Owner tetap dapat cuan meski gratis
    setCuan(c => c + 800);
    setSeaBank(sb => sb + 800);
    
    window.open(`https://wa.me/${u.wa}?text=Halo ${u.name} dari TemanDekat!`, "_blank");
  };

  const handleTopup = (amount) => {
    const bonus = amount >= 50000 ? 10000 : amount >= 25000 ? 5000 : 0;
    setSaldo(s => s + amount + bonus);
    setSeaBank(sb => sb + amount);
    setShowTopup(false);
    alert(`Topup Rp ${amount.toLocaleString()} berhasil!`);
  };

  const resetSeaBank = (val) => {
    const num = Number(val.toString().replace(/[^0-9]/g,"")) || 0;
    setSeaBank(num);
    setShowAdmin(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white p-4 max-w-[430px] mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-black text-xl">TemanDekat PRO {isAdminFree && <span className="text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full ml-2">OWNER FREE</span>}</h1>
        <button onClick={()=>setShowAdmin(true)} className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full font-bold">ADMIN</button>
      </div>

      {isAdminFree && <div className="bg-green-500/20 border border-green-500/40 text-green-300 text-xs p-2 rounded-xl mb-3 text-center">🔓 Mode Owner Aktif: Sapa GRATIS tanpa potong saldo, tetap dapat Cuan Rp 800!</div>}

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/10 p-3 rounded-xl">
          <div className="text-[10px] opacity-60">Saldo Sapa</div>
          <div className="font-bold text-sm">Rp {saldo.toLocaleString()}</div>
          {isAdminFree && <div className="text-[9px] text-green-400">FREE</div>}
        </div>
        <div className="bg-white/10 p-3 rounded-xl">
          <div className="text-[10px] opacity-60">Cuan</div>
          <div className="font-bold text-sm text-green-400">Rp {cuan.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-400/40">
          <div className="text-[10px]">SeaBank</div>
          <div className="font-black text-sm text-yellow-300">Rp {seaBank.toLocaleString()}</div>
        </div>
      </div>

      <button onClick={() => setShowTopup(true)} className="w-full bg-[#8b5cf6] py-3 rounded-xl font-bold mb-4">
        + Topup Saldo
      </button>

      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className="bg-[#1c1633] p-3 rounded-2xl flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">{u.name[0]}</div>
              <div>
                <div className="font-semibold text-sm">{u.name} • {u.jarak}</div>
                <div className="text-xs opacity-60">{u.bio}</div>
              </div>
            </div>
            <button onClick={() => handleSapa(u)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${isAdminFree ? 'bg-green-500 text-black' : 'bg-white text-black'}`}>
              {isAdminFree ? 'Sapa FREE' : 'Sapa 1k'}
            </button>
          </div>
        ))}
      </div>

      {showAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#1c1633] w-full rounded-2xl p-5 border border-yellow-500/30 max-h-[90vh] overflow-auto">
            <h2 className="font-bold text-yellow-300 mb-4">ADMIN PANEL - Khusus Kamu</h2>
            
            <div className="bg-black/40 p-3 rounded-xl mb-4">
              <div className="text-xs opacity-60">SeaBank Display</div>
              <div className="text-xl font-black">Rp {seaBank.toLocaleString()}</div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl mb-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-bold">Mode Owner Gratis Sapa</div>
                <div className="text-[11px] opacity-60">Aktifkan biar kamu sapa tanpa potong saldo</div>
              </div>
              <button onClick={()=>setIsAdminFree(!isAdminFree)} className={`px-4 py-2 rounded-full font-bold text-sm ${isAdminFree ? 'bg-green-500 text-black' : 'bg-white/20'}`}>
                {isAdminFree ? 'ON' : 'OFF'}
              </button>
            </div>

            <label className="text-xs">Set Saldo SeaBank Baru:</label>
            <input value={adminInput} onChange={e=>setAdminInput(e.target.value)} className="w-full bg-black/50 border border-white/20 rounded-xl p-3 mt-1 mb-3 text-white" />

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={()=>resetSeaBank(1000000)} className="bg-white/10 py-2 rounded-xl text-sm">1 JT</button>
              <button onClick={()=>resetSeaBank(5000000)} className="bg-yellow-500 text-black py-2 rounded-xl text-sm font-bold">5 JT</button>
              <button onClick={()=>resetSeaBank(10000000)} className="bg-white/10 py-2 rounded-xl text-sm">10 JT</button>
            </div>

            <div className="flex gap-2">
              <button onClick={()=>resetSeaBank(adminInput)} className="flex-1 bg-yellow-500 text-black py-3 rounded-xl font-bold">SIMPAN SEABANK</button>
              <button onClick={()=>setShowAdmin(false)} className="flex-1 bg-white/10 py-3 rounded-xl">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {showTopup && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center p-4 z-50">
          <div className="bg-[#1c1633] w-full max-w-[430px] rounded-t-3xl p-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Topup</h2>
              <button onClick={() => setShowTopup(false)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[10000,25000,50000,100000].map(a=>(
                <button key={a} onClick={()=>handleTopup(a)} className="bg-white/10 p-3 rounded-xl text-left">
                  <div className="font-bold">Rp {a.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
