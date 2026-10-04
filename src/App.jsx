import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- KONFIGURASI REAL ---
const OWNER_EMAIL = "triangga406@gmail.com";
const PLATFORM_FEE = 0.05; // 5% untuk pemilik
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [user, setUser] = useState({ email: "triangga406@gmail.com", name: "Tri Angga" });
  const [coins, setCoins] = useState(1000);
  const [saldo, setSaldo] = useState(0);
  const [likes, setLikes] = useState(0);
  const [page, setPage] = useState("Beranda");
  
  const isOwner = user.email === OWNER_EMAIL;
  const [ownerCuan, setOwnerCuan] = useState(() => {
    const saved = localStorage.getItem('owner_cuan');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('owner_cuan', ownerCuan);
  }, [ownerCuan]);

  // --- MESIN 1: KIRIM GIFT DENGAN FEE 5% KE PEMILIK ---
  const handleKirimGift = () => {
    const giftPrice = 100; // 100 coins
    if (coins < giftPrice) return alert("Coins tidak cukup! Beli dulu di Dompet");
    
    const feeUntukOwner = Math.floor(giftPrice * PLATFORM_FEE);
    const giftUntukPenerima = giftPrice - feeUntukOwner;

    setCoins(c => c - giftPrice);
    setOwnerCuan(prev => prev + feeUntukOwner);
    
    alert(`Gift terkirim! ${giftUntukPenerima} coins ke teman, ${feeUntukOwner} coins (5%) otomatis masuk ke Pemilik ${OWNER_EMAIL}`);
  };

  // --- MESIN 2: BELI COINS = UANG MASUK KE PEMILIK ---
  const handleBeliCoins = (paket) => {
    // paket: { coins: 1000, harga: 15000 }
    if (!confirm(`Beli ${paket.coins} Coins seharga Rp ${paket.harga.toLocaleString()}? Uang akan masuk ke saldo bisnis pemilik.`)) return;
    
    // Simulasi Midtrans berhasil
    setCoins(c => c + paket.coins);
    setOwnerCuan(prev => prev + paket.harga); // Ini yang bikin pemilik cuan
    setSaldo(s => s + paket.harga);
    
    alert(`Berhasil! ${paket.coins} Coins masuk. Pemilik dapat Rp ${paket.harga.toLocaleString()}`);
  };

  // --- MESIN 3: REFERRAL = SEMAKIN BANYAK USER = ASET ---
  const handleReferral = () => {
    const kode = "MAHA" + Math.floor(Math.random()*999);
    navigator.clipboard.writeText(`https://teman-dekat-ggjq.vercel.app?ref=${kode}`);
    alert(`Link referral disalin! Setiap teman yang daftar pakai link kamu, kamu dapat 200 Coins. Pemilik dapat 1 user baru = aset.`);
    setCoins(c => c + 200); // bonus
  };

  const DompetPage = () => (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: '#FFD700' }}>Dompet</h2>
      <div style={{ background: '#222', padding: 15, borderRadius: 12, marginBottom: 15 }}>
        <p>Coins: <b style={{ color: '#FFD700' }}>{coins}</b></p>
        <p>Saldo: <b>Rp{saldo.toLocaleString()}</b></p>
      </div>

      {isOwner && (
        <div style={{ background: '#000', border: '2px solid #00FF88', padding: 15, borderRadius: 12, marginBottom: 20 }}>
          <h3 style={{ color: '#00FF88' }}>👑 DASHBOARD PEMILIK</h3>
          <p style={{ color: '#00FF88' }}>Email: {OWNER_EMAIL}</p>
          <p style={{ fontSize: 24, color: '#00FF88' }}>Total Cuan Masuk: Rp {ownerCuan.toLocaleString()}</p>
          <p style={{ fontSize: 12 }}>Rumus: Semakin banyak yang pakai Kirim Gift & Beli Coins = Cuan ini naik otomatis</p>
          <button onClick={() => alert(`Tarik Rp ${ownerCuan} ke SeaBank via Xendit`)} style={{ width: '100%', padding: 10, background: '#00FF88', color: '#000', fontWeight: 'bold', borderRadius: 8, marginTop: 10 }}>Tarik ke SeaBank</button>
        </div>
      )}

      <h3>Beli Coins (Mesin Cuan #2)</h3>
      <button onClick={() => handleBeliCoins({ coins: 500, harga: 10000 })} style={btnStyle}>500 Coins - Rp 10.000</button>
      <button onClick={() => handleBeliCoins({ coins: 1000, harga: 15000 })} style={btnStyle}>1000 Coins - Rp 15.000 [POPULER]</button>
      <button onClick={() => handleBeliCoins({ coins: 5000, harga: 65000 })} style={btnStyle}>5000 Coins - Rp 65.000</button>
      
      <h3 style={{ marginTop: 20 }}>Undang Teman (Mesin Cuan #3)</h3>
      <button onClick={handleReferral} style={{ ...btnStyle, background: '#444' }}>Bagikan Link Referral - Dapat 200 Coins</button>

      <h3 style={{ marginTop: 20 }}>Penjelasan Tarik ke SeaBank Real</h3>
      <p style={{ fontSize: 12, color: '#aaa' }}>Untuk tarik beneran masuk SeaBank, daftar Xendit.co > Isi saldo bisnis > Pasang XENDIT_API_KEY di Vercel. Nanti saat user klik tarik, Xendit yang kirim uang ASLI. Bukan saldo palsu.</p>
    </div>
  );

  const BerandaPage = () => (
    <div>
      <div style={{ background: '#111', padding: 15 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
          <span style={{ background: '#FFD700', color: '#000', padding: '4px 12px', borderRadius: 20, fontWeight: 'bold' }}>LOCAL AREA</span>
          <span>🇮🇩 🇺🇸 🇨🇳 🇲🇾 🇮🇳 🇷🇺 🇸🇦</span>
        </div>
        <div style={{ background: '#222', borderRadius: 16, padding: 15, border: '1px solid #333' }}>
          <h2 style={{ margin: 0 }}>Halo, {user.name} 👋</h2>
          <p style={{ color: '#888', fontSize: 12 }}>GPS -7.72889,110.90685 • Solo • 🇮🇩</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <div style={statBox}><span>Coins</span><b style={{ color: '#FFD700' }}>{coins}</b></div>
            <div style={statBox}><span>Saldo</span><b>Rp{saldo}</b></div>
            <div style={statBox}><span>Likes</span><b>{likes}</b></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginTop: 15 }}>
          <div style={menuBox} onClick={() => setPage('Kotak Saran')}><span>📥</span><p>Kotak Saran</p></div>
          <div style={menuBox} onClick={handleKirimGift}><span>🎁</span><p>Kirim Gift</p></div>
          <div style={menuBox} onClick={() => setLikes(l=>l+1)}><span>❤️</span><p>Like</p></div>
          <div style={menuBox}><span>🎵</span><p>Hiburan</p></div>
          <div style={menuBox}><span>⚠️</span><p>Pertolongan SOS</p></div>
        </div>
      </div>
      <div style={{ padding: 15 }}>
        <h3>🌐 Global Feed</h3>
        <p style={{ color: '#666' }}>Belum ada saran • No suggestions yet</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: 70 }}>
      {page === "Beranda" && <BerandaPage />}
      {page === "Dompet" && <DompetPage />}
      {page !== "Beranda" && page !== "Dompet" && <div style={{ padding: 20 }}><h2>{page}</h2><p>Fitur {page} sedang aktif...</p><button onClick={() => setPage('Beranda')}>Kembali</button></div>}

      {/* BOTTOM NAV - SESUAI FOTO KAMU */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #222' }}>
        {[
          { name: 'Beranda', icon: '🏠' },
          { name: 'Radar', icon: '📍' },
          { name: 'Chat', icon: '💬' },
          { name: 'Live', icon: '📡' },
          { name: 'Dompet', icon: '👛' },
          { name: 'Profil', icon: '👤' },
        ].map(m => (
          <div key={m.name} onClick={() => setPage(m.name)} style={{ textAlign: 'center', color: page === m.name ? '#FFD700' : '#888', cursor: 'pointer' }}>
            <div style={{ fontSize: 20 }}>{m.icon}</div>
            <div style={{ fontSize: 10 }}>{m.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const statBox = { background: '#111', flex: 1, padding: 10, borderRadius: 10, display: 'flex', flexDirection: 'column' };
const menuBox = { background: '#222', padding: 15, borderRadius: 12, textAlign: 'center', cursor: 'pointer' };
const btnStyle = { width: '100%', padding: 12, marginBottom: 8, background: '#FFD700', color: '#000', fontWeight: 'bold', borderRadius: 10, border: 'none', cursor: 'pointer' };
