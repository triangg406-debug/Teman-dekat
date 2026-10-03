import { useState } from "react";

export default function App() {
  const [coins, setCoins] = useState(1000);
  const [saldo, setSaldo] = useState(0);
  const seaBankRek = "901122061680";
  const owner = "Tri Angga";

  const convert = () => {
    if(coins < 1000) return alert("Coins kurang");
    setCoins(c=>c-1000);
    setSaldo(s=>s+500000);
    alert("1000 Coins -> Rp500.000 masuk Saldo!");
  };

  const wd = () => {
    if(saldo < 1000) return alert("Convert dulu! Saldo masih Rp0");
    alert(`WD Rp${saldo} ke SeaBank ${seaBankRek} a.n ${owner} SUKSES!`);
    setSaldo(0);
  };

  const copyRek = () => {
    navigator.clipboard.writeText(seaBankRek);
    alert("Copy: "+seaBankRek);
  };

  return (
    <div className="bg-black min-h-screen text-white p-4">
      <div className="bg-[#1a1a1a] p-5 rounded-3xl border border-yellow-500/20">
        <p className="text-zinc-400 text-sm">Saldo <span className="bg-yellow-400 text-black text-[10px] px-2 py-1 rounded-full font-black ml-2">VERIFIED</span></p>
        <h1 className="text-4xl font-black">Rp{saldo.toLocaleString()}</h1>
        <p className="text-yellow-400 text-sm">{coins} Coins • 1 Like = Rp500</p>
        <div className="mt-3 bg-black p-3 rounded-xl border border-orange-500">
          <p className="text-xs text-orange-400">SeaBank Aktif:</p>
          <div className="flex justify-between items-center">
            <b className="font-mono">{seaBankRek}</b>
            <button onClick={copyRek} className="bg-orange-500 text-black px-3 py-1 rounded-full text-xs font-black">COPY</button>
          </div>
          <p className="text-[10px] text-zinc-500">a.n {owner}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <button onClick={convert} className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl">CONVERT 1000 Coins → Rp500k</button>
        <button onClick={wd} className="w-full bg-orange-500 text-black font-black py-4 rounded-2xl">WD KE SEABANK {seaBankRek.slice(-4)}</button>
      </div>

      <p className="text-center text-[11px] text-zinc-500 mt-4">ISO NARIK LANGSUNG - ORA NGENTENI WONG TOPUP - CONVERT -> WD -> MASUK {seaBankRek}</p>
    </div>
  );
}
