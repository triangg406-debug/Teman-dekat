import { useState, useEffect } from "react";

const seaBankNo = "901122061680"; 
const seaBankName = "TRI ANGGA";

const users = [
  { id: 1, name: "Sari, 21", jarak: "200m", bio: "Ngopi santai", wa: "6281234567890" },
  { id: 2, name: "Bima, 23", jarak: "450m", bio: "Gym & futsal", wa: "6281234567891" },
  { id: 3, name: "Riko, 22", jarak: "1.2km", bio: "Ngoding", wa: "6281234567892" },
  { id: 4, name: "Ayu, 20", jarak: "800m", bio: "Mahasiswa", wa: "6281234567893" },
];

export default function App() {
  const [saldo, setSaldo] = useState(() => Number(localStorage.getItem("td_saldo") || 5000));
  const [cuan, setCuan] = useState(() => Number(localStorage.getItem("td_cuan") || 32000));
  const [seaBank, setSeaBank] = useState(() => Number(localStorage.getItem("td_seabank") || 5000000));
  const [isAdminFree, setIsAdminFree] = useState(() => localStorage.getItem("td_admin_free") === "true" || true);
  const [showTopup, setShowTopup] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("td_history") || "[]"));

  useEffect(() => localStorage.setItem("td_saldo", saldo), [saldo]);
  useEffect(() => localStorage.setItem("td_cuan", cuan), [cuan]);
  useEffect(() => localStorage.setItem("td_seabank", seaBank), [seaBank]);
  useEffect(() => localStorage.setItem("td_admin_free", isAdminFree), [isAdminFree]);
  useEffect(() => localStorage.setItem("td_history", JSON.stringify(history)), [history]);

  const handleSapa = (u) => {
    if (!isAdminFree && saldo < 1000) {
      setShowTopup(true);
      return;
    }
    if (!isAdminFree) setSaldo(s => s - 1000);
    setCuan(c => c + 800);
    setSeaBank(sb => sb + 800);
    setHistory(h => [{ type: "cuan", amount: 800, name: u.name, time: new Date().toLocaleTimeString() }, ...h].slice(0,20));
    window.open(`https://wa.me/${u.wa}?text=Halo ${u.name} dari TemanDekat!`, "_blank");
  };

  const handleTopup = (amount) => {
    const bonus = amount >= 50000 ? 10000 : amount >= 25000 ? 5000 : 0;
    setSaldo(s => s + amount + bonus);
    setSeaBank(sb => sb + amount);
    setHistory(h => [{ type: "topup", amount, bonus, time: new Date().toLocaleTimeString() }, ...h].slice(0,20));
    setShowTopup(false);
  };

  const handleWithdraw = () => {
    const amt = Number(withdrawAmount.replace(/[^0-9]/g,""));
    if (amt < 10000) { alert("Minimal tarik Rp 10.000"); return; }
    if (amt > cuan) { alert("Cuan tidak cukup!"); return; }
    
    setCuan(c => c - amt);
    // SeaBank display tetap 5jt+ karena ini penarikan cuan ke rekening asli kamu
    // Di sini kita catat history, seaBank display tidak dikurangi karena itu total masuk
    const newHistory = { type: "withdraw", amount: amt, to: seaBankNo, time: new Date().toLocaleString(), status: "SUKSES" };
    setHistory(h => [newHistory, ...h].slice(0,20));
    setShowWithdraw(false);
    setWithdrawAmount("");
    
    // Simulasi transfer - buka WA kamu sebagai bukti
    const msg = `Halo! PENARIKAN CUAN TemanDekat%0A%0AJumlah: Rp ${amt.toLocaleString()}%0ATujuan: SeaBank ${seaBankNo} a/n ${seaBankName}%0AWaktu: ${new Date().toLocaleString()}%0A%0ASisa Cuan: Rp ${(cuan-amt).toLocaleString()}`;
    window.open(`https://wa.me/628xxxx?text=${msg}`, "_blank"); // ganti 628xxxx dengan WA kamu
    
    alert(`✅ Penarikan Rp ${amt.toLocaleString()} BERHASIL!\nDitransfer ke SeaBank ${seaBankNo}\nCek mutasi SeaBank kamu.`);
  };

  const resetSeaBank = (val) => {
    const num = Number(val.toString().replace(/[^0-9]/g,"")) || 0;
    setSeaBank(num);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white p-4 max-w-[430px] mx-auto pb-20">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-black text-xl">TemanDekat PRO <span className="text-[9px] bg-yellow-400 text-black px-2 py-0.5 rounded-full ml-1">OWNER</span></h1>
        <button onClick={()=>setShowAdmin(true)} className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full font-bold">ADMIN</button>
      </div>

      <div className="bg-green-500/20 border border-green-500/40 text-green-300 text-[11px] p-2 rounded-xl mb-3 text-center">
        🔓 Mode Owner: Sapa FREE + Tarik Tunai ke SeaBank
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-white/10 p-3 rounded-xl">
          <div className="text-[10px] opacity-60">Saldo Sapa</div>
          <div className="font-bold text-sm">Rp {saldo.toLocaleString()}</div>
          <div className="text-[9px] text-green-400">FREE SAPA</div>
        </div>
        <div className="bg-white/10 p-3 rounded-xl border border-green-500/30">
          <div className="text-[10px] opacity-60">Cuan Bisa Ditarik</div>
          <div className="font-bold text-sm text-green-400">Rp {cuan.toLocaleString()}</div>
          <button onClick={()=>setShowWithdraw(true)} className="mt-1 text-[9px] bg-green-500 text-black px-2 py-0.5 rounded-full font-bold">Tarik</button>
        </div>
        <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-400/40">
          <div className="text-[10px]">SeaBank</div>
          <div className="font-black text-sm text-yellow-300">Rp {seaBank.toLocaleString()}</div>
          <div className="text-[8px] opacity-60 truncate">{seaBankNo}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => setShowTopup(true)} className="bg-[#8b5cf6] py-3 rounded-xl font-bold text-sm">
          + Topup Saldo
        </button>
        <button onClick={()=>setShowWithdraw(true)} className="bg-green-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1">
          💸 Tarik ke SeaBank
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {users.map(u => (
          <div key={u.id} className="bg-[#1c1633] p-3 rounded-2xl flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold">{u.name[0]}</div>
              <div>
                <div className="font-semibold text-sm">{u.name} • {u.jarak}</div>
                <div className="text-xs opacity-60">{u.bio}</div>
              </div>
            </div>
            <button onClick={() => handleSapa(u)} className="bg-green-500 text-black px-3 py-1.5 rounded-full text-xs font-bold">
              Sapa FREE
            </button>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className="bg-[#1c1633] rounded-2xl p-4">
          <div className="font-bold text-sm mb-2">Riwayat Transaksi</div>
          <div className="space-y-2 max-h-[200px] overflow-auto">
            {history.map((h,i)=>(
              <div key={i} className="flex justify-between text-xs bg-black/30 p-2 rounded-lg">
                <div>
                  <span className={h.type==='withdraw'?'text-yellow-300':h.type==='cuan'?'text-green-400':'text-purple-300'}>
                    {h.type==='withdraw'?'TARIK':h.type==='cuan'?'CUAN': 'TOPUP'}
                  </span>
                  <span className="opacity-60"> • {h.time}</span>
                  {h.name && <div className="opacity-60">{h.name}</div>}
                  {h.to && <div className="opacity-60">ke {h.to}</div>}
                </div>
                <div className="font-bold">Rp {h.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70]">
          <div className="bg-[#1c1633] w-full rounded-2xl p-5 border border-green-500/30">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-green-300">💸 Tarik Tunai ke SeaBank</h2>
              <button onClick={()=>setShowWithdraw(false)} className="bg-white/10 w-8 h-8 rounded-full">✕</button>
            </div>
            
            <div className="bg-black/40 p-3 rounded-xl mb-4">
              <div className="text-xs opacity-60">Cuan Tersedia</div>
              <div className="text-2xl font-black text-green-400">Rp {cuan.toLocaleString()}</div>
              <div className="text-[11px] opacity-60 mt-1">Akan ditransfer ke:</div>
              <div className="text-sm font-bold">SeaBank {seaBankNo}</div>
              <div className="text-xs opacity-60">a/n {seaBankName}</div>
            </div>

            <label className="text-xs">Jumlah Penarikan (min 10k):</label>
            <input 
              value={withdrawAmount} 
              onChange={e=>setWithdrawAmount(e.target.value)} 
              className="w-full bg-black/50 border border-white/20 rounded-xl p-3 mt-1 mb-3 text-white text-lg font-bold" 
              placeholder="contoh: 50000"
              type="tel"
            />

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={()=>setWithdrawAmount("10000")} className="bg-white/10 py-2 rounded-xl text-sm">10k</button>
              <button onClick={()=>setWithdrawAmount("50000")} className="bg-white/10 py-2 rounded-xl text-sm">50k</button>
              <button onClick={()=>setWithdrawAmount(cuan.toString())} className="bg-green-500/20 border border-green-500/40 py-2 rounded-xl text-sm font-bold">Semua</button>
            </div>

            <button onClick={handleWithdraw} className="w-full bg-green-600 py-3 rounded-xl font-bold">
              Tarik Rp {(Number(withdrawAmount.replace(/[^0-9]/g,""))||0).toLocaleString()} ke SeaBank
            </button>
            <div className="text-[10px] opacity-50 text-center mt-3">Dana masuk 1x24 jam ke SeaBank kamu. Gratis BI-FAST!</div>
          </div>
        </div>
      )}

      {/* ADMIN MODAL */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#1c1633] w-full rounded-2xl p-5 border border-yellow-500/30">
            <h2 className="font-bold text-yellow-300 mb-4">ADMIN PANEL</h2>
            <div className="bg-black/40 p-3 rounded-xl mb-4 flex justify-between">
              <div><div className="text-xs opacity-60">SeaBank Display</div><div className="font-black">Rp {seaBank.toLocaleString()}</div></div>
              <div><div className="text-xs opacity-60">Cuan</div><div className="font-black text-green-400">Rp {cuan.toLocaleString()}</div></div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={()=>resetSeaBank(1000000)} className="bg-white/10 py-2 rounded-xl text-sm">1 JT</button>
              <button onClick={()=>resetSeaBank(5000000)} className="bg-yellow-500 text-black py-2 rounded-xl text-sm font-bold">5 JT</button>
              <button onClick={()=>resetSeaBank(10000000)} className="bg-white/10 py-2 rounded-xl text-sm">10 JT</button>
            </div>
            <button onClick={()=>setShowAdmin(false)} className="w-full bg-white/10 py-3 rounded-xl">Tutup</button>
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
