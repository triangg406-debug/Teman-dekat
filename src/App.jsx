import React, { useState, useEffect } from 'react';

// SUPABASE CLIENT - ganti nganggo punyamu proyek Teman-dekat
// import { supabase } from './supabaseClient'
// Untuk sementara pake dummy ben ora error pas build
const supabase = {
  from: () => ({ select: async () => ({ data: [] }), insert: async () => ({}), update: async () => ({}) }),
  functions: { invoke: async () => ({}) }
};

export default function App() {
  const [page, setPage] = useState('auth'); // auth, user, owner
  const [mode, setMode] = useState('user'); // user, owner
  const [tab, setTab] = useState('dekat');
  const [tapCount, setTapCount] = useState(0);
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [pin, setPin] = useState('');
  const [coins, setCoins] = useState(1000);
  const [saldo, setSaldo] = useState(0);
  const [saran, setSaran] = useState('');
  const [users, setUsers] = useState([
    { id: 1, nama: 'Sari - 200m', lokasi: 'Solo', coins: 500 },
    { id: 2, nama: 'Budi - 450m', lokasi: 'Kartasura', coins: 1200 },
    { id: 3, nama: 'Rina - 800m', lokasi: 'Sukoharjo', coins: 300 },
  ]);
  const [editUser, setEditUser] = useState(null);

  // Trik login pemilik rahasia - tap logo 5x
  const handleLogoTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setShowOwnerLogin(true);
      setTapCount(0);
    }
    setTimeout(() => setTapCount(0), 3000);
  };

  const handleOwnerLogin = () => {
    // PIN rahasia - ganti sesuai punyamu, ojo di-share
    if (pin === '1106') {
      setMode('owner');
      setPage('owner');
      setCoins(999999);
      setShowOwnerLogin(false);
      setPin('');
    } else {
      alert('PIN salah');
    }
  };

  const handleDaftar = () => {
    setMode('user');
    setPage('user');
    setTab('dekat');
  };

  const handleGift = (userId) => {
    if (mode === 'owner') {
      alert(`Pemilik nge-gift user ${userId} - GRATIS (Mode Dewa)`);
      // supabase.from('transactions').insert({ type: 'gift', amount: 100, from: 'owner', to: userId, fee: 0 })
      return;
    }
    if (coins >= 100) {
      setCoins(coins - 100);
      alert('Gift terkirim - 100 coins kepotong');
      // Potong 10% fee nggo pemilik
      // supabase.from('wallets').update({ coins: coins - 100 }).eq('user_id', 'xxx')
      // supabase.from('transactions').insert({ type: 'gift', amount: 100, fee: 10 })
    } else {
      alert('Coins kurang, Topup disik neng Dompet');
      setTab('dompet');
    }
  };

  const handleTopup = (metode) => {
    const amount = 20000;
    alert(`Topup ${metode} Rp${amount} - status PENDING. Nek duit asli mlebu, finance-processor bakal ubah jadi SUCCESS & coins nambah otomatis.`);
    // Alur REAL:
    // 1. supabase.from('topup_requests').insert({ user_id, amount, metode, status: 'pending' })
    // 2. User transfer neng SeaBank/DANA mu
    // 3. Webhook Midtrans -> Edge Function finance-processor -> cek duit mlebu tenan
    // 4. UPDATE wallets SET coins = coins + X WHERE user_id
    // 5. INSERT transactions status success
  };

  const handleWd = () => {
    alert('WD Request - potong coins + fee 10% nggo pemilik. Diproses via finance-processor');
  };

  if (page === 'auth') {
    return (
      <div style={styles.auth}>
        <div style={styles.logo} onClick={handleLogoTap}>
          <h1 style={{ margin: 0, letterSpacing: 2 }}>LOCAL AREA</h1>
          <p style={{ fontSize: 12, opacity: 0.7, marginTop: 5 }}>Tap logo 5x untuk mode rahasia</p>
        </div>

        <div style={styles.authBox}>
          <button style={styles.btnPrimary} onClick={handleDaftar}>DAFTAR (Jadi User)</button>
          <button style={styles.btnSecondary} onClick={() => setPage('user')}>LOG IN (User Biasa)</button>
          <p style={{ fontSize: 11, marginTop: 15, opacity: 0.6, textAlign: 'center' }}>
            Pemilik yo kudu daftar sek nek pengen dadi User.<br/>Login pemilik rahasia, ora ono tombol e.
          </p>
        </div>

        {showOwnerLogin && (
          <div style={styles.ownerModal}>
            <h3>Login Pemilik Rahasia</h3>
            <input type="password" placeholder="PIN Pemilik" value={pin} onChange={e => setPin(e.target.value)} style={styles.input} />
            <button onClick={handleOwnerLogin} style={styles.btnPrimary}>Masuk Mode Dewa</button>
            <button onClick={() => setShowOwnerLogin(false)} style={styles.btnText}>Batal</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h3 style={{ margin: 0 }}>LOCAL AREA {mode === 'owner' && <span style={{ color: '#FFD700' }}>• DEWA</span>}</h3>
        <div style={styles.coinBox}>
          <span>Coins: {coins}</span>
          <span style={{ marginLeft: 10 }}>Rp{saldo}</span>
        </div>
      </header>

      <main style={styles.main}>
        {tab === 'dekat' && (
          <div>
            <h4>Beranda Dekat</h4>
            <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
              <button style={styles.smallBtn}>Saran</button>
              <button style={styles.smallBtn}>Gift</button>
              <button style={styles.smallBtn}>Like</button>
              <button style={styles.smallBtn}>Hiburan</button>
              <button style={{ ...styles.smallBtn, background: '#ff4757', color: 'white' }}>pertolongan</button>
            </div>
            <input placeholder="Tulis saran anonim..." value={saran} onChange={e => setSaran(e.target.value)} style={styles.inputFull} />
            <button style={styles.btnPrimary} onClick={() => { alert('Saran terkirim anonim'); setSaran(''); }}>Kirim</button>

            <div style={{ marginTop: 20 }}>
              {users.map(u => (
                <div key={u.id} style={styles.userCard}>
                  <div>
                    <b>{u.nama}</b><br/><small>{u.lokasi} - Coins {u.coins}</small>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => handleGift(u.id)} style={styles.smallBtn}>Gift</button>
                    {mode === 'owner' && (
                      <>
                        <button onClick={() => setEditUser(u)} style={{ ...styles.smallBtn, background: '#FFD700' }}>Edit</button>
                        <button style={{ ...styles.smallBtn, background: '#2ed573', color: 'white' }}>Delok</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'chat' && <div><h4>Chat</h4><p>Chat karo wong cedak. Pemilik iso ndelok kabeh chat (Mode Dewa).</p></div>}

        {tab === 'hiburan' && (
          <div>
            <h4>Hiburan - Ben Betah</h4>
            <p>Jantung e APK ben user betah, ora bosen.</p>
            <div style={styles.videoGrid}>
              <div style={styles.video}>Live 1</div>
              <div style={styles.video}>Video 2</div>
              <div style={styles.video}>Live 3</div>
            </div>
            {mode === 'owner' && <button style={styles.btnPrimary}>Edit Hiburan (Mode Dewa)</button>}
          </div>
        )}

        {tab === 'dompet' && (
          <div>
            <h4>Dompet - Iso Dadi Duit</h4>
            <p>Coins: {coins} | Saldo: Rp{saldo}</p>
            <h5>Topup REAL (Duit mlebu SeaBank mu)</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button onClick={() => handleTopup('DANA')} style={styles.smallBtn}>DANA</button>
              <button onClick={() => handleTopup('ShopeePay')} style={styles.smallBtn}>ShopeePay</button>
              <button onClick={() => handleTopup('SeaBank')} style={styles.smallBtn}>SeaBank</button>
              <button onClick={() => handleTopup('GoPay')} style={styles.smallBtn}>GoPay</button>
            </div>
            <h5 style={{ marginTop: 15 }}>Withdraw</h5>
            <button onClick={handleWd} style={styles.btnPrimary}>WD Sekarang (fee 10% nggo pemilik)</button>
            <div style={{ marginTop: 15 }}>
              <h5>Riwayat Transaksi (Supabase: transactions)</h5>
              <small>Topup 20k - success - DANA<br/>Gift ke Sari - 100 coins - fee 10</small>
            </div>
            {mode === 'owner' && (
              <div style={{ marginTop: 20, padding: 10, background: '#222', borderRadius: 8 }}>
                <h5 style={{ color: '#FFD700' }}>Saldo Pemilik (soko fee)</h5>
                <p>Rp 152.000 - soko fee topup & gift user</p>
              </div>
            )}
          </div>
        )}

        {tab === 'profil' && (
          <div>
            <h4>Profil</h4>
            <p>Mode: {mode} {mode === 'owner' && '(DEWA - iso ngedit opo wae, ndelok sopo wae, nge-gift sopo wae)'}</p>
            <button onClick={() => setPage('auth')} style={styles.btnSecondary}>Logout</button>
          </div>
        )}
      </main>

      <nav style={styles.nav}>
        <button onClick={() => setTab('dekat')} style={tab === 'dekat' ? styles.navActive : styles.navBtn}>Beranda</button>
        <button onClick={() => setTab('chat')} style={tab === 'chat' ? styles.navActive : styles.navBtn}>Chat</button>
        <button onClick={() => setTab('hiburan')} style={tab === 'hiburan' ? styles.navActive : styles.navBtn}>Hiburan</button>
        <button onClick={() => setTab('dompet')} style={tab === 'dompet' ? styles.navActive : styles.navBtn}>Dompet</button>
        <button onClick={() => setTab('profil')} style={tab === 'profil' ? styles.navActive : styles.navBtn}>Profil</button>
      </nav>

      {editUser && (
        <div style={styles.ownerModal}>
          <h3>Edit User (Mode Dewa)</h3>
          <p>{editUser.nama}</p>
          <input defaultValue={editUser.nama} style={styles.input} />
          <input defaultValue={editUser.coins} style={styles.input} />
          <button onClick={() => setEditUser(null)} style={styles.btnPrimary}>Simpen</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  auth: { minHeight: '100vh', background: '#000', color: '#FFD700', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { textAlign: 'center', marginBottom: 30, cursor: 'pointer', userSelect: 'none' },
  authBox: { width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 },
  btnPrimary: { background: '#FFD700', color: '#000', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' },
  btnSecondary: { background: '#222', color: '#FFD700', border: '1px solid #FFD700', padding: '12px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' },
  btnText: { background: 'transparent', color: '#fff', border: 'none', padding: 8, cursor: 'pointer' },
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#111', color: 'white', marginBottom: 10 },
  inputFull: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#111', color: 'white', marginBottom: 10, boxSizing: 'border-box' },
  ownerModal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#111', padding: 20, borderRadius: 12, border: '1px solid #FFD700', width: 280, zIndex: 10 },
  app: { minHeight: '100vh', background: '#000', color: 'white', paddingBottom: 70 },
  header: { background: '#111', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', position: 'sticky', top: 0 },
  coinBox: { fontSize: 12, background: '#222', padding: '5px 10px', borderRadius: 20 },
  main: { padding: 15 },
  smallBtn: { padding: '6px 10px', borderRadius: 6, border: 'none', background: '#222', color: 'white', cursor: 'pointer', fontSize: 12 },
  userCard: { background: '#111', padding: 10, borderRadius: 8, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  videoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 },
  video: { background: '#111', height: 100, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  nav: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #222' },
  navBtn: { background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 12 },
  navActive: { background: '#FFD700', border: 'none', color: '#000', cursor: 'pointer', fontSize: 12, padding: '6px 12px', borderRadius: 20, fontWeight: 'bold' },
};
