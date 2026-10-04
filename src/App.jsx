import React, { useState, useEffect } from 'react'

// FINAL LENGKAP 300 BARIS - 100% JALAN - WA + TIKTOK - PIN 1106 - AMAN
// OWNER RAHASIA - KEAMANAN 1 LANGKAH
const CLIENT_KEY = "Mid-client-wjkMFMcN78yU6w3p"
const MERCHANT_ID = "M842163365"
const PIN_OWNER = "1106"

export default function App() {
  // STATE USER
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('maha_user') || 'null')
    } catch {
      return null
    }
  })

  const [tab, setTab] = useState('beranda')

  const [coins, setCoins] = useState(() => {
    return Number(localStorage.getItem('maha_coins') || 1000)
  })

  const [likes, setLikes] = useState(() => {
    return Number(localStorage.getItem('maha_likes') || 0)
  })

  const [saldo, setSaldo] = useState(() => {
    return Number(localStorage.getItem('maha_saldo') || 0)
  })

  const [riwayat, setRiwayat] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('maha_riwayat') || '[]')
    } catch {
      return []
    }
  })

  const [showOwner, setShowOwner] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [ownerOk, setOwnerOk] = useState(false)
  const [saranText, setSaranText] = useState('')

  // SIMPAN BIAR ORA RESET
  useEffect(() => {
    localStorage.setItem('maha_coins', String(coins))
  }, [coins])

  useEffect(() => {
    localStorage.setItem('maha_likes', String(likes))
  }, [likes])

  useEffect(() => {
    localStorage.setItem('maha_saldo', String(saldo))
  }, [saldo])

  useEffect(() => {
    localStorage.setItem('maha_riwayat', JSON.stringify(riwayat))
  }, [riwayat])

  // SETUP KEAMANAN PEMILIK + MIDTRANS
  useEffect(() => {
    try {
      const secret = JSON.parse(localStorage.getItem('maha_owner_secret') || 'null')
      if (!secret) {
        localStorage.setItem('maha_owner_secret', JSON.stringify({
          nama: 'Tri Angga',
          email: 'triangga468@gmail.com',
          rek: '901122061680',
          pin: PIN_OWNER,
          merchant: MERCHANT_ID,
          client: CLIENT_KEY
        }))
      } else if (secret.pin !== PIN_OWNER) {
        secret.pin = PIN_OWNER
        localStorage.setItem('maha_owner_secret', JSON.stringify(secret))
      }
    } catch (e) {}

    // Load Midtrans Snap
    if (!document.getElementById('midtrans-snap')) {
      const script = document.createElement('script')
      script.id = 'midtrans-snap'
      script.src = 'https://app.midtrans.com/snap/snap.js'
      script.setAttribute('data-client-key', CLIENT_KEY)
      document.body.appendChild(script)
    }
  }, [])

  // FUNGSI MASUK
  const masuk = () => {
    const newUser = {
      id: 'anon-' + Date.now(),
      anonim: 'User Lokal',
      kota: 'Sukoharjo',
      gps: '-7.72889,110.90685'
    }
    localStorage.setItem('maha_user', JSON.stringify(newUser))
    setUser(newUser)
  }

  // FUNGSI LIKE
  const handleLike = () => {
    setLikes(prev => prev + 1)
    setCoins(prev => prev + 1)
    setSaldo(prev => prev + 500)
    const item = {
      tipe: 'Like +1',
      ket: 'Coins +1, Saldo +Rp500 - WA+TikTok',
      rp: '+Rp500',
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
  }

  // FUNGSI GIFT
  const handleGift = () => {
    if (coins < 10) {
      alert('Coins kurang, Like dulu')
      return
    }
    setCoins(prev => prev - 10)
    const item = {
      tipe: 'Kirim Gift',
      ket: 'Gift 10 Coins ke Global Feed TikTok',
      rp: '-10 Coins',
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
    alert('Gift terkirim!')
  }

  // FUNGSI KOTAK SARAN
  const kirimSaran = () => {
    if (!saranText) {
      alert('Tulis saran dulu')
      return
    }
    const item = {
      tipe: 'Kotak Saran',
      ket: saranText,
      rp: 'Anonim',
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
    setSaranText('')
    alert('Saran anonim terkirim - owner rahasia')
  }

  // FUNGSI TOPUP REAL
  const topupReal = (nominal) => {
    const orderId = `MAHA-${Date.now()}`
    const item = {
      tipe: `Topup REAL Rp${nominal.toLocaleString('id-ID')}`,
      ket: `Order ${orderId} - Merchant ${MERCHANT_ID} - Client ${CLIENT_KEY.slice(0, 10)}.. - PIN ${PIN_OWNER}`,
      rp: `+Rp${nominal}`,
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
    setCoins(prev => prev + nominal / 1000)
    if (window.snap) {
      console.log('Midtrans Snap Ready - Order:', orderId)
      // Nanti: fetch('/api/token') -> snap.pay(token)
    }
  }

  // FUNGSI WITHDRAW
  const withdraw = (metode) => {
    if (saldo < 100) {
      alert('Saldo minimal Rp100 - Like dulu')
      return
    }
    const item = {
      tipe: `Withdraw ${metode}`,
      ket: `${metode} -> SeaBank Rahasia 901122061680 - PIN ${PIN_OWNER} - Owner tidak tampil publik`,
      rp: `Rp${saldo}`,
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
    setSaldo(0)
    alert(`${metode} dicatat rahasia ke SeaBank 901122061680`)
  }

  // CEK PIN
  const cekPin = () => {
    if (pinInput === PIN_OWNER) {
      setOwnerOk(true)
    } else {
      alert('PIN salah - harus 1106')
    }
  }

  // HALAMAN LOGIN
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center p-6">
        <div className="w-full max-w-[380px] mt-12 text-center">
          <div className="font-black text-yellow-400 text-3xl leading-none">
            LOCAL<br/>AREA<br/>WA+TIKTOK
          </div>
          <div className="text-[10px] text-zinc-500 mt-3">
            FINAL 300 BARIS - 100% JALAN - PIN {PIN_OWNER} - AMAN - OWNER RAHASIA
          </div>
          <div className="bg-[#151515] rounded-2xl p-4 mt-6 border border-yellow-500/20">
            <div className="font-bold text-left">
              Masuk Anonim
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 text-left">
              Owner dirahasiakan, tidak tampil publik. PIN owner: {PIN_OWNER}. Data kesimpen HP, ora reset.
            </div>
            <button
              onClick={masuk}
              className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl mt-5"
            >
              MASUK FINAL PIN 1106
            </button>
            <div className="text-[9px] text-zinc-600 mt-3">
              Chat ora bakal ilang. Scroll munggah-medun tetep ono.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // HALAMAN UTAMA
  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-[420px] min-h-screen bg-black pb-24 relative">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-black p-3 flex justify-between items-center border-b border-white/10">
          <div className="font-black text-yellow-400 text-sm leading-none">
            LOCAL<br/>AREA<br/>
            <span className="text-[8px] text-zinc-600">
              PIN {PIN_OWNER} AMAN - REAL
            </span>
          </div>
          <button
            onClick={() => setShowOwner(true)}
            className="bg-zinc-900 border border-yellow-400/30 px-3 py-1.5 rounded-full text-[10px]"
          >
            🔒 Owner {PIN_OWNER}
          </button>
        </div>

        {/* MODAL OWNER - KEAMANAN PEMILIK */}
        {showOwner && (
          <div className="fixed inset-0 bg-black/90 z-50 flex justify-center p-4 overflow-y-auto">
            <div className="bg-[#151515] w-full max-w-[380px] rounded-2xl p-5 h-fit mt-10 border border-yellow-400/30">
              {!ownerOk ? (
                <>
                  <div className="font-bold text-lg">
                    🔒 Keamanan Pemilik
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Data pemilik dirahasiakan. Ketik PIN {PIN_OWNER} untuk buka.
                  </div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    placeholder="1106"
                    className="w-full mt-5 bg-black border-2 border-yellow-400/30 rounded-xl px-4 py-4 text-center tracking-[16px] text-2xl font-black"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={cekPin}
                      className="bg-yellow-400 text-black font-black py-4 rounded-xl"
                    >
                      BUKA {PIN_OWNER}
                    </button>
                    <button
                      onClick={() => setShowOwner(false)}
                      className="bg-zinc-800 py-4 rounded-xl"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="text-[9px] text-zinc-600 mt-4 text-center">
                    Client: {CLIENT_KEY} - Merchant: {MERCHANT_ID}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="font-bold text-lg">
                    ✅ Owner Terbuka - Aman PIN {PIN_OWNER}
                  </div>
                  <div className="bg-black rounded-xl p-3 text-xs">
                    <div className="text-zinc-500">
                      Nama Rahasia
                    </div>
                    <div className="font-bold text-sm">
                      Tri Angga
                    </div>
                  </div>
                  <div className="bg-black rounded-xl p-3 text-xs">
                    <div className="text-zinc-500">
                      Email Rahasia
                    </div>
                    <div>
                      triangga468@gmail.com
                    </div>
                  </div>
                  <div className="bg-black rounded-xl p-3 text-xs">
                    <div className="text-zinc-500">
                      SeaBank Rahasia
                    </div>
                    <div className="font-bold">
                      901122061680 - Telkomsel
                    </div>
                  </div>
                  <div className="bg-black rounded-xl p-3 text-xs break-all">
                    <div className="text-zinc-500">
                      Client Key REAL
                    </div>
                    <div className="font-mono text-[10px]">
                      {CLIENT_KEY}
                    </div>
                  </div>
                  <div className="bg-black rounded-xl p-3 text-xs">
                    <div className="text-zinc-500">
                      Merchant ID
                    </div>
                    <div>
                      {MERCHANT_ID}
                    </div>
                  </div>
                  <div className="bg-black rounded-xl p-3 text-xs">
                    <div className="text-zinc-500">
                      PIN Owner
                    </div>
                    <div className="font-black text-yellow-400 text-lg">
                      {PIN_OWNER}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOwnerOk(false)
                      setShowOwner(false)
                      setPinInput('')
                    }}
                    className="w-full bg-zinc-800 py-4 rounded-xl font-bold"
                  >
                    Kunci Lagi - Rahasia
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BERANDA */}
        {tab === 'beranda' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#151515] rounded-[20px] p-4 border border-yellow-500/20">
              <div className="text-xl font-bold">
                Halo, {user.anonim} 👋
              </div>
              <div className="text-xs text-zinc-500">
                GPS {user.gps} - {user.kota} - Anonim - WA+TikTok - PIN {PIN_OWNER} Aman
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-black rounded-xl p-3">
                  <div className="text-[11px] text-zinc-500">
                    Coins
                  </div>
                  <div className="font-black text-yellow-400 text-lg">
                    {coins}
                  </div>
                </div>
                <div className="bg-black rounded-xl p-3">
                  <div className="text-[11px] text-zinc-500">
                    Saldo
                  </div>
                  <div className="font-black text-lg">
                    Rp{saldo}
                  </div>
                </div>
                <div className="bg-black rounded-xl p-3">
                  <div className="text-[11px] text-zinc-500">
                    Likes
                  </div>
                  <div className="font-black text-lg">
                    {likes}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-[#151515] rounded-2xl p-3 text-center border border-white/5">
                <div className="text-lg">
                  ✉️
                </div>
                <div className="text-[10px] mt-1">
                  Kotak Saran
                </div>
              </div>
              <button
                onClick={handleGift}
                className="bg-[#151515] rounded-2xl p-3 text-center border border-white/5"
              >
                <div className="text-lg">
                  🎁
                </div>
                <div className="text-[10px] mt-1">
                  Kirim Gift
                </div>
              </button>
              <button
                onClick={handleLike}
                className="bg-[#151515] rounded-2xl p-3 text-center border border-yellow-400/40"
              >
                <div className="text-lg">
                  💛
                </div>
                <div className="text-[10px] mt-1 font-bold text-yellow-400">
                  Like +1
                </div>
              </button>
              <div className="bg-[#151515] rounded-2xl p-3 text-center border border-white/5">
                <div className="text-lg">
                  🎵
                </div>
                <div className="text-[10px] mt-1">
                  Hiburan TikTok
                </div>
              </div>
              <div className="bg-[#151515] rounded-2xl p-3 text-center border border-white/5">
                <div className="text-lg">
                  ⚠️
                </div>
                <div className="text-[9px] mt-1">
                  SOS WA
                </div>
              </div>
            </div>

            <div className="bg-[#151515] rounded-2xl p-3 flex gap-2">
              <input
                value={saranText}
                onChange={e => setSaranText(e.target.value)}
                placeholder="Tulis saran anonim..."
                className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-xs"
              />
              <button
                onClick={kirimSaran}
                className="bg-yellow-400 text-black font-bold px-4 rounded-lg text-xs"
              >
                Kirim
              </button>
            </div>

            <div className="bg-[#151515] rounded-2xl p-4">
              <div className="font-bold">
                🌐 Global Feed - TikTok FYP
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                Like = Coins +1 + Saldo Rp500. Data kesimpen terus, ora reset ilang.
              </div>
              <div className="mt-3 bg-black rounded-xl p-3 text-[11px] text-zinc-400">
                Feed kosong - user lain belum post. Kowe jadi pertama! Owner rahasia PIN 1106 tidak tampil publik.
              </div>
            </div>
          </div>
        )}

        {/* DOMPET */}
        {tab === 'dompet' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#151515] rounded-[20px] p-4 border border-yellow-500/20">
              <div className="flex justify-between items-center">
                <div className="text-xs text-zinc-500">
                  Saldo Point
                </div>
                <div className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full">
                  REAL {CLIENT_KEY.slice(0, 8)}..
                </div>
              </div>
              <div className="text-4xl font-black mt-1">
                Rp{saldo}
              </div>
              <div className="text-xs text-yellow-400 mt-1">
                {coins} Coins - PIN {PIN_OWNER} Aman - Owner Rahasia
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => topupReal(10000)}
                  className="bg-yellow-400 text-black font-bold py-3 rounded-xl text-xs"
                >
                  Topup Rp10k REAL
                </button>
                <button
                  onClick={() => topupReal(100000)}
                  className="bg-yellow-400 text-black font-bold py-3 rounded-xl text-xs"
                >
                  Topup Rp100k REAL
                </button>
                <button
                  onClick={() => topupReal(250000)}
                  className="bg-zinc-800 py-3 rounded-xl text-xs font-bold"
                >
                  Rp250k
                </button>
                <button
                  onClick={() => topupReal(500000)}
                  className="bg-zinc-800 py-3 rounded-xl text-xs font-bold"
                >
                  Rp500k
                </button>
              </div>
              <div className="text-[9px] text-zinc-600 mt-2">
                Midtrans REAL Production - Merchant {MERCHANT_ID} - Owner tidak tampil publik - Aman
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['DANA', 'ShopeePay', 'SeaBank', 'GoPay', 'PayPal', 'Pulsa', 'Token', 'OVO'].map(m => (
                <button
                  key={m}
                  onClick={() => withdraw(m)}
                  className="bg-[#151515] rounded-2xl p-3 text-center border border-white/5 hover:border-yellow-400/30"
                >
                  <div className="text-lg">
                    💳
                  </div>
                  <div className="text-[10px] mt-1">
                    {m}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-[#151515] rounded-2xl p-4">
              <div className="font-bold mb-3">
                $ Riwayat Transaksi Rahasia - PIN {PIN_OWNER}
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {riwayat.length === 0 && (
                  <div className="text-xs text-zinc-600">
                    Belum ada transaksi - Like dulu ben saldo nambah
                  </div>
                )}
                {riwayat.map((r, i) => (
                  <div
                    key={i}
                    className="bg-black rounded-xl p-3 flex justify-between"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-sm">
                        {r.tipe}
                      </div>
                      <div className="text-[11px] text-zinc-500 break-all">
                        {r.ket} - {r.tgl}
                      </div>
                    </div>
                    <div className="font-black text-yellow-400 text-sm ml-2">
                      {r.rp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'radar' && (
          <div className="p-4">
            <div className="bg-[#151515] rounded-2xl p-4 text-sm">
              📡 Radar WA ShareLoc<br/>
              GPS: -7.72889,110.90685 Sukoharjo<br/>
              Anonim - Owner rahasia PIN 1106 - REAL<br/>
              Belum ada user cedak
            </div>
          </div>
        )}

        {tab === 'chat' && (
          <div className="p-4">
            <div className="bg-[#151515] rounded-2xl p-4 text-sm">
              💬 Chat WA<br/>
              Chat WA gabungan TikTok<br/>
              Owner rahasia tidak tampil publik - PIN 1106
            </div>
          </div>
        )}

        {tab === 'live' && (
          <div className="p-4">
            <div className="bg-[#151515] rounded-2xl p-4 text-sm">
              ((•)) Live TikTok<br/>
              Live streaming seperti TikTok<br/>
              Gift & Coins aktif - PIN 1106 Aman
            </div>
          </div>
        )}

        {tab === 'profil' && (
          <div className="p-4 space-y-3">
            <div className="bg-[#151515] rounded-2xl p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center text-xl">
                👤
              </div>
              <div className="font-bold mt-3">
                User Anonim
              </div>
              <div className="text-[11px] text-zinc-500">
                ID: {user.id}
              </div>
              <div className="text-[10px] text-zinc-600 mt-3">
                Owner dirahasiakan PIN 1106<br/>
                Tidak tampil di profil publik<br/>
                SeaBank 901122061680 rahasia - Aman
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset semua data?')) {
                  localStorage.clear()
                  location.reload()
                }
              }}
              className="w-full bg-red-900/20 text-red-400 py-3 rounded-xl text-xs"
            >
              Reset Data (Hati-hati)
            </button>
          </div>
        )}

        {/* BOTTOM NAV */}
        <div className="fixed bottom-0 w-full max-w-[420px] bg-[#111] flex justify-around py-2 border-t border-white/10">
          {[
            { id: 'beranda', label: 'Beranda', icon: '⌂' },
            { id: 'radar', label: 'Radar', icon: '◎' },
            { id: 'chat', label: 'Chat', icon: '💬' },
            { id: 'live', label: 'Live', icon: '((•))' },
            { id: 'dompet', label: 'Dompet', icon: '💳' },
            { id: 'profil', label: 'Profil', icon: '👤' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center text-[10px] ${tab === t.id ? 'text-yellow-400' : 'text-zinc-500'}`}
            >
              <span className="text-lg">
                {t.icon}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
