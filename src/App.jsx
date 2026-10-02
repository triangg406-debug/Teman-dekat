import { useState, useEffect } from "react";
const seaBankNo = "901122061680"; // GANTI NO SEABANK ASLI KAMU
const seaBankName = "TRI ANGGA";

const users = [
  { id: 1, name: "Sari, 21", jarak: "200m", wa: "6281234567890" },
  { id: 2, name: "Bima, 23", jarak: "450m", wa: "6281234567891" },
  { id: 3, name: "Riko, 22", jarak: "1.2km", wa: "6281234567892" },
];

export default function App() {
  const [cuan, setCuan] = useState(() => Number(localStorage.getItem("td_cuan") || 0));
  const [seaBank, setSeaBank] = useState(() => Number(localStorage.getItem("td_seabank") || 5000000));
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => localStorage.setItem("td_cuan", cuan), [cuan]);
  useEffect(() => localStorage.setItem("td_seabank", seaBank), [seaBank]);

  const handleSapa = (u) => {
    setCuan(c => c + 800);
    setSeaBank(sb => sb + 800);
    window.open(`https://wa.me/${u.wa}?text=Halo ${u.name}`, "_blank");
  };

  const handleWithdraw = () => {
    const amt = Number(withdrawAmount.replace(/[^0-9]/g,""));
    if (amt < 1000 || amt > cuan) return alert("Cuan gak cukup!");
    setCuan(c => c - amt);
    setShowWithdraw(false);
    setWithdrawAmount("");
    alert(`✅ SUKSES!\nRp ${amt.toLocaleString()} ditarik ke SeaBank ${seaBankNo}\nUangnya udah di SeaBank kamu!`);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white p-4 max-w-[430px] mx-auto">
      <h1 className="font-black text-xl mb-3">TemanDekat PRO - OWNER</h1>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/40">
          <div className="text-[10px]">Cuan Hasil Sapa (Bisa Ditarik)</div>
          <div className="font-black text-green-300">Rp {cuan.toLocaleString()}</div>
        </div>
        <div className="bg-yellow-500/20 p-3 rounded-xl">
          <div className="text-[10px]">SeaBank {seaBankNo}</div>
          <div className="font-black text-yellow-300">Rp {seaBank.toLocaleString()}</div>
        </div>
      </div>

      <button onClick={()=>setShowWithdraw(true)} className="w-full bg-green-600 py-3 rounded-xl font-bold mb-4">
        💸 TARIK Rp {cuan.toLocaleString()} KE SEABANK
      </button>

      <div className="space-y-3">
        {users.map(u => (
          <div key={u.id} className="bg-[#1c1633] p-3 rounded-2xl flex justify-between items-center">
            <div className="font-semibold text-sm">{u.name} • {u.jarak}</div>
            <button onClick={() => handleSapa(u)} className="bg-green-500 text-black px-4 py-2 rounded-full text-xs font-black">
              Sapa +800
            </button>
          </div>
        ))}
      </div>

      {showWithdraw && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c1633] w-full rounded-2xl p-5">
            <h2 className="font-bold text-green-300 mb-3">Tarik ke SeaBank {seaBankNo}</h2>
            <div className="text-2xl font-black mb-3">Rp {cuan.toLocaleString()}</div>
            <input value={withdrawAmount} onChange={e=>setWithdrawAmount(e.target.value)} className="w-full bg-black/50 border rounded-xl p-3 mb-3" placeholder="50000"/>
            <button onClick={handleWithdraw} className="w-full bg-green-600 py-3 rounded-xl font-bold">Tarik Sekarang</button>
            <button onClick={()=>setShowWithdraw(false)} className="w-full mt-2 bg-white/10 py-2 rounded-xl">Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
