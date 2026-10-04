import { useState, useEffect } from 'react';

export default function App() {
  // === KONFIGURASI KUNCI - TRI ANGGA - SEABANK 1680 ===
  const SEA_BANK = "9017011680";
  const NAMA_REK = "TRI ANGGA";
  const WA_NUMBER = "6281234567890"; // GANTI WA ASLI MU DISINI

  // === STATE UTAMA - SEMUA FUNGSI BALIK ===
  const [users] = useState([]); // Feed kosong sesuai request - demo Sari/Bima/Riko dihapus
  const [posts, setPosts] = useState([
    { id: 1, author: "System", text: "Selamat datang Tri! App full fungsi sudah ready. Sapa user untuk dapat Coins!", likes: 0 }
  ]);
  const [coins, setCoins] = useState(1000);
  const [saldo, setSaldo] = useState(0);
  const [riwayat, setRiwayat] = useState([]);
  const [tab, setTab] = useState('feed');
  const [newPost, setNewPost] = useState('');
  const [wdNominal, setWdNominal] = useState(500000);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");

  // Load & Save ke HP biar gak hilang
  useEffect(() => {
    const s = localStorage.getItem('t-gqjq-full-saldo');
    const c = localStorage.getItem('t-gqjq-full-coins');
    const r = localStorage.getItem('t-gqjq-full-riwayat');
    const p = localStorage.getItem('t-gqjq-full-posts');
    if (s) setSaldo(Number(s));
    if (c) setCoins(Number(c));
    if (r) setRiwayat(JSON.parse(r));
    if (p) setPosts(JSON.parse(p));
  }, []);
  useEffect(() => {
    localStorage.setItem('t-gqjq-full-saldo', saldo.toString());
    localStorage.setItem('t-gqjq-full-coins', coins.toString());
    localStorage.setItem('t-gqjq-full-riwayat', JSON.stringify(riwayat));
    localStorage.setItem('t-gqjq-full-posts', JSON.stringify(posts));
  }, [saldo, coins, riwayat, posts]);

  const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(""), 3500); };

  // === FUNGSI 1: SAPA (DAPAT COINS) ===
  const handleSapa = (postId) => {
    setPosts(posts.map(po => po.id === postId ? {...po, likes: po.likes + 1} : po));
    setCoins(c => c + 10);
    setSaldo(s => s + 5000); // 1 sapa = Rp5000 biar cepet - bisa ganti 500
    showNotif("+10 Coins (+Rp5.000) dari Sapa!");
  };

  // === FUNGSI 2: BUAT POSTING ===
  const handlePosting = () => {
    if (!newPost.trim()) return;
    const newP = { id: Date.now(), author: NAMA_REK, text: newPost, likes: 0 };
    setPosts([newP, ...posts]);
    setNewPost('');
    showNotif("Posting berhasil! Tunggu disapa orang biar dapat Coins");
  };

  // === FUNGSI 3: CONVERT COINS -> SALDO (YANG KEMARIN) ===
  const handleConvert = () => {
    if (coins < 100) return showNotif("Minimal 100 Coins untuk Convert");
    const rate = 500; // 1 coin = Rp500
    const hasil = coins * rate;
    setSaldo(saldo + hasil);
    setCoins(0);
    const trx = { id: Date.now(), jenis: "CONVERT", nominal: hasil, tujuan: `${coins} Coins → Saldo`, status: "BERHASIL", waktu: new Date().toLocaleString('id-ID') };
    setRiwayat([trx, ...riwayat]);
    showNotif(`CONVERT BERHASIL! ${coins} Coins → Rp${hasil.toLocaleString('id-ID')}`);
  };

  // === FUNGSI 4: WD KE SEABANK 1680 - TRANSAKSI LANCAR ===
  const handleWD = () => {
    if (saldo < 10000) return showNotif("Saldo minimal Rp10.000");
    if (wdNominal > saldo) return showNotif("Saldo tidak cukup!");
    if (wdNominal < 10000) return showNotif("Minimal WD Rp10.000");
    setLoading(true);
    setTimeout(() => {
      const trx = { id: Date.now(), jenis: "PENARIKAN", nominal: wdNominal, tujuan: `SeaBank ${SEA_BANK} a.n ${NAMA_REK}`, status: "BERHASIL CAIR", waktu: new Date().toLocaleString('id-ID') };
      setRiwayat([trx, ...riwayat]);
      setSaldo(saldo - wdNominal);
      setLoading(false);
      showNotif(`SUKSES CAIR! Rp${wdNominal.toLocaleString('id-ID')} ke SeaBank ${SEA_BANK.slice(-4)}`);
      setTab('dompet');
      // Auto WA (buka WA)
      // window.open(`https://wa.me/${WA_NUMBER}?text=Halo%20Tri%20WD%20Rp${wdNominal}%20ke%20SeaBank%20${SEA_BANK}%20berhasil`, '_blank');
    }, 1500);
  };

  // === FUNGSI 5: CHAT WA PEMBELI ===
  const handleChatWA = () => {
    window.open(`https://wa.me/${WA_NUMBER}?text=Halo%20${NAMA_REK}%20saya%20mau%20sapa%20di%20T-GQJQ`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-md mx-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-black/90 backdrop-blur z-10 p-4 border-b border-zinc-900 flex justify-between items-center">
          <div>
            <h1 className="font-black text-sm">T-GQJQ FULL</h1>
            <p className="text-[10px] text-zinc-500">SeaBank {SEA_BANK} • {NAMA_REK} • {coins} Coins • Rp{saldo.toLocaleString('id-ID')}</p>
          </div>
          <button onClick={handleChatWA} className="bg-green-600 text-white text-[10px] px-3 py-2 rounded-full font-bold">WA</button>
        </div>

        {notif && <div className="mx-4 mt-3 bg-green-600 text-white text-xs text-center py-3 rounded-xl font-bold">{notif}</div>}

        {/* === FEED TAB - FUNGSI AWAL BALIK === */}
        {tab === 'feed' && (
          <div className="p-4 space-y-4">
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Tulis sesuatu... nanti disapa dapat Coins!" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm h-20"></textarea>
              <button onClick={handlePosting} className="w-full mt-3 bg-white text-black py-3 rounded-xl font-bold text-sm">POSTING</button>
            </div>

            <h2 className="font-bold text-sm">Global Feed ({posts.length}) {users.length===0 && "- Demo Sari/Bima/Riko dihapus"}</h2>
            {posts.map(post => (
              <div key={post.id} className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <p className="text-xs text-zinc-400">{post.author} • {post.likes} Sapa</p>
                <p className="text-sm mt-2">{post.text}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={()=>handleSapa(post.id)} className="flex-1 bg-yellow-500/10 border border-yellow-600/30 text-yellow-400 py-2 rounded-xl text-xs font-bold">👋 SAPA (+10 Coins)</button>
                  <button onClick={handleChatWA} className="bg-zinc-800 py-2 px-4 rounded-xl text-xs">Chat</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === DOMPET TAB - SEMUA FUNGSI === */}
        {tab === 'dompet' && (
          <div className="p-4 space-y-4">
            <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-6 border border-zinc-800">
              <p className="text-zinc-500 text-[11px]">COINS & SALDO</p>
              <div className="flex justify-between mt-2">
                <div><p className="text-zinc-400 text-xs">Coins</p><p className="text-2xl font-black text-yellow-400">{coins}</p></div>
                <div className="text-right"><p className="text-zinc-400 text-xs">Saldo</p><p className="text-2xl font-black text-green-400">Rp{saldo.toLocaleString('id-ID')}</p></div>
              </div>
              <div className="mt-4 bg-black rounded-xl p-3 border border-zinc-800 text-[11px]">
                <p>Rek: <b className="text-white">{SEA_BANK} a.n {NAMA_REK}</b></p>
                <p className="text-zinc-500">Rate: 1 Coin = Rp500 | 1 Sapa = 10 Coins</p>
              </div>

              {/* CONVERT - FUNGSI AWAL */}
              <button onClick={handleConvert} disabled={coins===0} className={`w-full mt-4 py-4 rounded-xl font-black text-sm ${coins>0 ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-600'}`}>
                {coins>0 ? `CONVERT ${coins} Coins → Rp${(coins*500).toLocaleString('id-ID')}` : 'TIDAK ADA COINS UNTUK CONVERT'}
              </button>

              {/* WD - FUNGSI TRANSAKSI LANCAR */}
              <div className="mt-4 bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                <p className="text-xs font-bold">PENARIKAN KE SEABANK 1680</p>
                <input type="number" value={wdNominal} onChange={e=>setWdNominal(Number(e.target.value))} className="w-full mt-2 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-sm" />
                <div className="flex gap-2 mt-2">
                  {[50000,100000,500000].map(n=> <button key={n} onClick={()=>setWdNominal(n)} className="flex-1 bg-zinc-700 text-[10px] py-2 rounded-lg">Rp{n/1000}K</button>)}
                </div>
                <button onClick={handleWD} disabled={loading || saldo===0} className={`w-full mt-3 py-4 rounded-xl font-black text-sm ${saldo>0 ? 'bg-green-500 text-white' : 'bg-zinc-700 text-zinc-500'}`}>
                  {loading ? '⏳ PROSES CAIR...' : saldo>0 ? `WD Rp${wdNominal.toLocaleString('id-ID')} KE SEABANK` : 'SALDO 0 - SAPA DULU'}
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <p className="font-bold text-sm mb-2">Riwayat Cepat ({riwayat.length})</p>
              {riwayat.length===0 ? <p className="text-xs text-zinc-600">Belum ada transaksi - WD pertama akan muncul disini</p> : riwayat.slice(0,3).map(t=>(
                <div key={t.id} className="flex justify-between text-xs py-2 border-b border-zinc-800"><span>{t.jenis} • {t.status}</span><span className="font-bold">Rp{t.nominal.toLocaleString('id-ID')}</span></div>
              ))}
              {riwayat.length>0 && <button onClick={()=>setTab('riwayat')} className="w-full mt-2 text-[11px] text-zinc-400">Lihat Semua Riwayat →</button>}
            </div>
          </div>
        )}

        {/* === RIWAYAT TAB - TRANSAKSI BERJALAN LANCAR === */}
        {tab === 'riwayat' && (
          <div className="p-4">
            <h2 className="font-bold mb-4">Riwayat Transaksi Full ({riwayat.length})</h2>
            {riwayat.length===0 ? <div className="text-center py-16 bg-zinc-900 rounded-2xl border border-zinc-800"><p className="text-zinc-500 text-sm">Belum ada transaksi</p></div> : riwayat.map(t=>(
              <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3">
                <div className="flex justify-between"><p className="text-xs font-bold text-green-400">{t.jenis}</p><p className="text-[10px] text-zinc-500">{t.waktu}</p></div>
                <p className="text-lg font-bold mt-1">Rp{t.nominal.toLocaleString('id-ID')} • {t.status}</p>
                <p className="text-[11px] text-zinc-400">{t.tujuan}</p>
              </div>
            ))}
          </div>
        )}

        {/* === PROFIL TAB === */}
        {tab === 'profil' && (
          <div className="p-4 space-y-4">
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full mx-auto flex items-center justify-center font-black text-xl">{NAMA_REK[0]}</div>
              <p className="font-bold mt-3">{NAMA_REK}</p>
              <p className="text-xs text-zinc-500">SeaBank {SEA_BANK}</p>
              <p className="text-xs text-green-400 mt-2">VERIFIED • Saldo Rp{saldo.toLocaleString('id-ID')} • {coins} Coins</p>
            </div>
          </div>
        )}

        {/* NAV BAWAH - HP FRIENDLY */}
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex max-w-md mx-auto">
          {[
            {id:'feed', label:'Feed'},
            {id:'dompet', label:'Dompet'},
            {id:'riwayat', label:'Riwayat'},
            {id:'profil', label:'Profil'},
          ].map(m=>(
            <button key={m.id} onClick={()=>setTab(m.id)} className={`flex-1 py-4 text-[11px] font-black ${tab===m.id ? 'text-white border-t-2 border-green-500 bg-zinc-800' : 'text-zinc-500'}`}>{m.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
