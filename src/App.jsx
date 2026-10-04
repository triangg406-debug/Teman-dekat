import { useState, useEffect } from 'react';

export default function App() {
  const SEA_BANK = "9017011680";
  const NAMA = "TRI ANGGA";

  const [coins, setCoins] = useState(1000);
  const [saldo, setSaldo] = useState(500000);
  const [riwayat, setRiwayat] = useState([]);
  const [tab, setTab] = useState('dompet');
  const [wdNominal, setWdNominal] = useState(500000);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('t-gqjq-riwayat');
    const savedSaldo = localStorage.getItem('t-gqjq-saldo');
    const savedCoins = localStorage.getItem('t-gqjq-coins');
    if (saved) setRiwayat(JSON.parse(saved));
    if (savedSaldo) setSaldo(Number(savedSaldo));
    if (savedCoins) setCoins(Number(savedCoins));
  }, []);

  useEffect(() => {
    localStorage.setItem('t-gqjq-riwayat', JSON.stringify(riwayat));
    localStorage.setItem('t-gqjq-saldo', saldo.toString());
    localStorage.setItem('t-gqjq-coins', coins.toString());
  }, [riwayat, saldo, coins]);

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 3000);
  };

  const handleWD = () => {
    if (saldo < 10000) return showNotif("Saldo minimal Rp10.000 untuk WD");
    if (wdNominal > saldo) return showNotif("Saldo tidak cukup!");
    if (wdNominal < 10000) return showNotif("Minimal WD Rp10.000");
    setLoading(true);
    setTimeout(() => {
      const trx = {
        id: Date.now(),
        jenis: "PENARIKAN",
        nominal: wdNominal,
        tujuan: `SeaBank ${SEA_BANK} a.n ${NAMA}`,
        status: "BERHASIL CAIR",
        waktu: new Date().toLocaleString('id-ID'),
      };
      setRiwayat([trx, ...riwayat]);
      setSaldo(saldo - wdNominal);
      setLoading(false);
      showNotif(`SUKSES! Rp${wdNominal.toLocaleString('id-ID')} cair ke SeaBank 1680`);
      setTab('riwayat');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-md mx-auto">
        <div className="p-4 flex justify-between items-center border-b border-zinc-900 sticky top-0 bg-black z-10">
          <h1 className="font-bold">T-GQJQ • {NAMA} • KUNCI FINAL</h1>
        </div>
        {notif && <div className="mx-4 mt-3 bg-green-600 text-white text-xs text-center py-2 rounded-xl">{notif}</div>}
        {tab === 'dompet' && (
          <div className="p-4">
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-700">
              <p className="text-zinc-400 text-xs">TOTAL SALDO BISA TARIK</p>
              <p className="text-4xl font-black text-green-400 mt-1">Rp{saldo.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-zinc-500 mt-2">SeaBank {SEA_BANK} a.n {NAMA} • {coins} Coins</p>
              <div className="mt-6 bg-black/50 rounded-2xl p-4 border border-zinc-800">
                <input type="number" value={wdNominal} onChange={(e) => setWdNominal(Number(e.target.value))} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mt-1 text-sm" />
                <button onClick={handleWD} disabled={loading || saldo === 0} className={`w-full mt-4 py-4 rounded-xl font-black text-sm ${saldo > 0 ? 'bg-green-500 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                  {loading ? 'MEMPROSES...' : `TARIK Rp${wdNominal.toLocaleString('id-ID')} KE SEABANK 1680`}
                </button>
                <p className="text-[9px] text-zinc-600 text-center mt-2">Semua fungsi jalan - WD - Transaksi - Riwayat lancar</p>
              </div>
            </div>
          </div>
        )}
        {tab === 'riwayat' && (
          <div className="p-4">
            <h2 className="font-bold mb-4">Riwayat ({riwayat.length})</h2>
            {riwayat.length === 0 ? <p className="text-zinc-500 text-sm text-center py-10">Belum ada penarikan</p> : riwayat.map(t => (
              <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
                <p className="text-xs font-bold text-green-400">{t.jenis} • {t.status}</p>
                <p className="text-lg font-bold">-Rp{t.nominal.toLocaleString('id-ID')}</p>
                <p className="text-[11px] text-zinc-400">{t.tujuan} • {t.waktu}</p>
              </div>
            ))}
          </div>
        )}
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex max-w-md mx-auto">
          {[{id:'dompet', label:'Dompet'},{id:'riwayat', label:'Riwayat'}].map(m => (
            <button key={m.id} onClick={() => setTab(m.id)} className={`flex-1 py-4 text-xs font-bold ${tab===m.id ? 'text-white border-t-2 border-green-500 bg-zinc-800' : 'text-zinc-500'}`}>{m.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
