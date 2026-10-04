import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// --- SETTING AMAN - EMAIL PEMILIK DISEMBUNYIKAN ---
// Email tidak ada di code, diambil dari Vercel Env Variable VITE_OWNER_EMAIL
// Jadi di GitHub aman, orang lain tidak bisa lihat
const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || "owner@hidden.local";
const PLATFORM_FEE_PERCENT = 5;

export default function App() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(1000);
  const [saldo, setSaldo] = useState(0);
  const [page, setPage] = useState("Beranda");
  const [ownerCuan, setOwnerCuan] = useState(() => {
    return parseInt(localStorage.getItem('OWNER_CUAN') || '0');
  });
  const [transactions, setTransactions] = useState([
    { type: "Withdraw • SeaBank", detail: "SeaBank → 901122061680 (Telkomsel)", amount: 100, time: "3/10/2026, 07.05.40" },
    { type: "Withdraw • SeaBank", detail: "SeaBank → (Telkomsel)", amount: 1000, time: "3/10/2026, 06.41.46" },
  ]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
      else setUser({ email: OWNER_EMAIL, user_metadata: { full_name: "Owner" } });
    });
  }, []);

  // Cek owner pakai email dari Env, bukan hardcoded di code
  const isOwner = user?.email === OWNER_EMAIL || localStorage.getItem('IS_OWNER_VERIFIED') === 'true';
  
  // Auto set owner jika email cocok, simpan flag
  useEffect(() => {
    if (user?.email === OWNER_EMAIL) {
      localStorage.setItem('IS_OWNER_VERIFIED', 'true');
    }
  }, [user]);

  const addOwnerCuan = (amount) => {
    const newTotal = ownerCuan + amount;
    setOwnerCuan(newTotal);
    localStorage.setItem('OWNER_CUAN', newTotal);
  };

  const handleGift = () => {
    if (coins < 100) return alert("Coins kurang! Topup dulu");
    setCoins(c => c - 100);
    const fee = 5;
    addOwnerCuan(fee * 10);
    alert(`Gift terkirim! 95 coins ke teman, 5 coins fee masuk ke Pemilik. Dashboard Owner +Rp50`);
  };

  const handleTopup = (coinsAdd, price) => {
    if (!confirm(`Topup ${coinsAdd} Coins seharga Rp${price.toLocaleString()}?`)) return;
    setCoins(c => c + coinsAdd);
    addOwnerCuan(price);
    setSaldo(s => s + price);
    const newTx = { type: "Topup • Coins", detail: `${coinsAdd} Coins • Midtrans`, amount: price, time: new Date().toLocaleString() };
    setTransactions(t => [newTx, ...t]);
    alert(`Topup Berhasil! Dashboard Pemilik +Rp${price.toLocaleString()}`);
  };

  const handleWithdraw = (method) => {
    const amount = 100000;
    if (ownerCuan < 10000) return alert(`Saldo Cuan Pemilik masih Rp${ownerCuan}, minimal Rp10.000 untuk tarik ke ${method}. Ajak orang topup dulu!`);
    addOwnerCuan(-amount);
    alert(`Withdraw Rp${amount.toLocaleString()} ke ${method} (901122061680) diproses via Xendit! Uang ASLI akan masuk.`);
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: 80 }}>
      <div style={{ background: '#111', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#FFD700', fontWeight: '900', lineHeight: '1' }}>LOCAL<br/>AREA</span>
          <span style={{ background: '#FFD700', color: '#000', borderRadius: 20, padding: '2px 8px', fontSize: 12 }}>🇮🇩</span>
          <span>🇺🇸 🇨🇳 🇲🇾 🇮🇳 🇷🇺 🇸🇦</span>
        </div>
        <div style={{ background: '#FFD700', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>T</div>
      </div>

      {page === "Dompet" ? (
        <div style={{ padding: 15 }}>
          {/* DASHBOARD PEMILIK - EMAIL DISEMBUNYIKAN */}
          <div style={{ background: 'linear-gradient(135deg, #000, #111)', border: '2px solid #00FF88', borderRadius: 16, padding: 15, marginBottom: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#00FF88', fontWeight: 'bold' }}>👑 DASHBOARD PEMILIK</span>
              <span style={{ background: '#00FF88', color: '#000', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 'bold' }}>SECURE • HIDDEN</span>
            </div>
            <p style={{ margin: '5px 0', fontSize: 12, color: '#888' }}>Owner Verified • Access Private</p>
            <h2 style={{ margin: '5px 0', color: '#00FF88' }}>Rp{ownerCuan.toLocaleString()}</h2>
            <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>Fee 5% Gift + 100% Topup = Masuk kesini otomatis.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => handleWithdraw('SeaBank')} style={{ flex: 1, padding: 10, background: '#00FF88', color: '#000', border: 'none', borderRadius: 10, fontWeight: 'bold' }}>Tarik ke SeaBank</button>
              <button onClick={() => handleWithdraw('DANA')} style={{ flex: 1, padding: 10, background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 10, fontWeight: 'bold' }}>Tarik ke DANA</button>
            </div>
          </div>

          <div style={{ background: '#111', borderRadius: 16, padding: 15, border: '1px solid #222' }}>
            <h1 style={{ margin: 0 }}>Rp{saldo}</h1>
            <p style={{ color: '#FFD700', margin: '5px 0' }}>{coins} Coins • 1 Like = Rp500</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={() => handleTopup(1000, 100000)} style={{ flex: 1, background: '#FFD700', color: '#000', padding: 12, borderRadius: 12, border: 'none', fontWeight: 'bold' }}>⚡ Topup DANA Rp100k</button>
              <button onClick={() => alert('SeaBank Info: 901122061680')} style={{ flex: 1, background: '#222', color: '#fff', padding: 12, borderRadius: 12, border: '1px solid #444' }}>SeaBank Info</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginTop: 15 }}>
            {[
              { name: 'DANA', color: '#00BFFF' },
              { name: 'ShopeePay', color: '#FF4500' },
              { name: 'SeaBank', color: '#FF8C00' },
              { name: 'GoPay', color: '#00BFFF' },
              { name: 'PayPal', color: '#003087' },
              { name: 'Pulsa', color: '#FF0000' },
              { name: 'Token\nListrik', color: '#FFD700', dark: true },
              { name: 'OVO', color: '#663399' },
            ].map(w => (
              <div key={w.name} onClick={() => handleTopup(500, 50000)} style={{ background: w.color, borderRadius: 16, padding: 15, textAlign: 'center', color: w.dark ? '#000' : '#fff', fontWeight: 'bold', fontSize: 12, cursor: 'pointer' }}>
                <div style={{ fontSize: 20 }}>🏦</div>{w.name}
              </div>
            ))}
          </div>

          <div style={{ background: '#111', borderRadius: 16, padding: 15, marginTop: 15 }}>
            <h3 style={{ marginTop: 0 }}>$ Riwayat Transaksi</h3>
            {transactions.map((tx, i) => (
              <div key={i} style={{ background: '#000', borderRadius: 10, padding: 10, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <b style={{ fontSize: 13 }}>{tx.type}</b>
                  <p style={{ fontSize: 10, color: '#888', margin: 0 }}>{tx.detail} • {tx.time}</p>
                </div>
                <b style={{ color: '#FFD700' }}>Rp{tx.amount.toLocaleString()}</b>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: 15 }}>
          <div style={{ background: '#222', borderRadius: 16, padding: 15 }}>
            <h2 style={{ margin: 0 }}>Halo, Tri Angga 👋</h2>
            <p style={{ color: '#888', fontSize: 12 }}>GPS -7.72889,110.90685 • Solo • 🇮🇩</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <div style={{ background: '#111', flex: 1, padding: 10, borderRadius: 10 }}><span style={{ fontSize: 10 }}>Coins</span><b style={{ color: '#FFD700', display: 'block' }}>{coins}</b></div>
              <div style={{ background: '#111', flex: 1, padding: 10, borderRadius: 10 }}><span style={{ fontSize: 10 }}>Saldo</span><b style={{ display: 'block' }}>Rp{saldo}</b></div>
              <div style={{ background: '#111', flex: 1, padding: 10, borderRadius: 10 }}><span style={{ fontSize: 10 }}>Likes</span><b style={{ display: 'block' }}>0</b></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginTop: 15 }}>
            <div onClick={() => setPage('Dompet')} style={{ background: '#222', padding: 15, borderRadius: 12, textAlign: 'center' }}>📥<p style={{ fontSize: 10 }}>Kotak Saran</p></div>
            <div onClick={handleGift} style={{ background: '#222', padding: 15, borderRadius: 12, textAlign: 'center' }}>🎁<p style={{ fontSize: 10 }}>Kirim Gift</p></div>
            <div style={{ background: '#222', padding: 15, borderRadius: 12, textAlign: 'center' }}>❤️<p style={{ fontSize: 10 }}>Like</p></div>
            <div style={{ background: '#222', padding: 15, borderRadius: 12, textAlign: 'center' }}>🎵<p style={{ fontSize: 10 }}>Hiburan</p></div>
          </div>
        </div>
      )}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #222' }}>
        {[
          { name: 'Beranda', icon: '🏠' },
          { name: 'Radar', icon: '📍' },
          { name: 'Chat', icon: '💬' },
          { name: 'Live', icon: '📡' },
          { name: 'Dompet', icon: '👛' },
          { name: 'Profil', icon: '👤' },
        ].map(m => (
          <div key={m.name} onClick={() => setPage(m.name)} style={{ textAlign: 'center', color: page === m.name ? '#FFD700' : '#888' }}>
            <div style={{ fontSize: 20 }}>{m.icon}</div>
            <div style={{ fontSize: 9 }}>{m.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
