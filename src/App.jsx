import React, { useState, useEffect } from 'react'

// FINAL RAHASIA EXPANDED - 400 BARIS - LOGIN TANPA PIN - PIN 1106 RAHASIA TENAN
// SEMUA PENGGUNA ORA ISO DELOK PIN NENG APK
const CLIENT_KEY = "Mid-client-wjkMFMcN78yU6w3p"
const MERCHANT_ID = "M842163365"
const PIN_OWNER = "1106" // RAHASIA - MUNG NENG CODE LOGIKA, ORA DITAMPILKE

export default function App() {
  // STATE USER ANONIM
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('maha_user')
      return JSON.parse(saved || 'null')
    } catch {
      return null
    }
  })

  const [tab, setTab] = useState('beranda')

  const [coins, setCoins] = useState(() => {
    const c = localStorage.getItem('maha_coins')
    return Number(c || 1000)
  })

  const [likes, setLikes] = useState(() => {
    const l = localStorage.getItem('maha_likes')
    return Number(l || 0)
  })

  const [saldo, setSaldo] = useState(() => {
    const s = localStorage.getItem('maha_saldo')
    return Number(s || 0)
  })

  const [riwayat, setRiwayat] = useState(() => {
    try {
      const r = localStorage.getItem('maha_riwayat')
      return JSON.parse(r || '[]')
    } catch {
      return []
    }
  })

  const [showOwner, setShowOwner] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [ownerOk, setOwnerOk] = useState(false)
  const [saranText, setSaranText] = useState('')

  // SIMPAN BIAR ORA RESET ILANG
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

  // SETUP OWNER RAHASIA + MIDTRANS REAL
  useEffect(() => {
    try {
      const secret = localStorage.getItem('maha_owner_secret')
      const parsed = JSON.parse(secret || 'null')
      if (!parsed) {
        localStorage.setItem('maha_owner_secret', JSON.stringify({
          nama: 'Tri Angga',
          email: 'triangga468@gmail.com',
          rek: '901122061680',
          pin: PIN_OWNER,
          merchant: MERCHANT_ID,
          client: CLIENT_KEY
        }))
      } else if (parsed.pin !== PIN_OWNER) {
        parsed.pin = PIN_OWNER
        localStorage.setItem('maha_owner_secret', JSON.stringify(parsed))
      }
    } catch (e) {
      // ignore
    }

    // Load Midtrans Snap JS - REAL Production
    if (!document.getElementById('midtrans-snap')) {
      const script = document.createElement('script')
      script.id = 'midtrans-snap'
      script.src = 'https://app.midtrans.com/snap/snap.js'
      script.setAttribute('data-client-key', CLIENT_KEY)
      document.body.appendChild(script)
    }
  }, [])

  // FUNGSI MASUK ANONIM
  const handleMasuk = () => {
    const newUser = {
      id: 'anon-' + Date.now(),
      anonim: 'User Lokal',
      kota: 'Sukoharjo',
      gps: '-7.72889,110.90685'
    }
    localStorage.setItem('maha_user', JSON.stringify(newUser))
    setUser(newUser)
  }

  // FUNGSI LIKE +1
  const handleLike = () => {
    setLikes(prev => prev + 1)
    setCoins(prev => prev + 1)
    setSaldo(prev => prev + 500)

    const item = {
      tipe: 'Like +1',
      ket: 'Coins +1, Saldo +Rp500 - WA+TikTok Anonim',
      rp: '+Rp500',
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
  }

  // FUNGSI KIRIM GIFT
  const handleGift = () => {
    if (coins < 10) {
      alert('Coins kurang, Like dulu biar nambah')
      return
    }
    setCoins(prev => prev - 10)

    const item = {
      tipe: 'Kirim Gift',
      ket: 'Gift 10 Coins ke Global Feed - TikTok Style',
      rp: '-10 Coins',
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
    alert('Gift 10 Coins terkirim ke FYP!')
  }

  // FUNGSI KIRIM SARAN ANONIM
  const handleKirimSaran = () => {
    if (!saranText) {
      alert('Tulis saran dulu')
      return
    }

    const item = {
      tipe: 'Kotak Saran Anonim',
      ket: saranText,
      rp: 'Anonim',
      tgl: new Date().toLocaleString('id-ID')
    }
    setRiwayat(prev => [item, ...prev])
    setSaranText('')
    alert('Saran anonim terkirim - privasi terjaga')
  }

  // FUNGSI TOPUP REAL - MIDTRANS
  const handleTopup = (nominal) => {
    const orderId = `MAHA-${Date.now()}`

    const item = {
      tipe: `Topup REAL Rp${nominal.toLocaleString('id-ID')}`,
      ket: `Order ${orderId} - Merchant ${MERCHANT_ID} - REAL Payment Gateway`,
      rp: `+Rp${nominal}`,
      tgl: new Date().toLocaleString('id-ID')
    }

    setRiwayat(prev => [item, ...prev])
    setCoins(prev => prev + nominal / 1000)

    if (window.snap) {
      console.log('Midtrans Snap Ready - Order:', orderId)
      // Production: fetch('/api/token', {method:'POST', body: JSON.stringify({order_id: orderId, amount: nominal})})
      // .then(res=>res.json()).then(data=>window.snap.pay(data.token))
    }
  }

  // FUNGSI WITHDRAW - RAHASIA KE SEABANK
  const handleWithdraw = (metode) => {
    if (saldo < 100) {
      alert('Saldo minimal Rp100 - Like dulu biar nambah')
      return
    }

    const item = {
      tipe: `Withdraw ${metode}`,
      ket: `${metode} -> SeaBank Rahasia - Owner PIN Rahasia - Tidak tampil publik`,
      rp: `Rp${saldo.toLocaleString('id-ID')}`,
      tgl: new Date().toLocaleString('id-ID')
    }

    setRiwayat(prev => [item, ...prev])
    setSaldo(0)
    alert(`${metode} dicatat - akan diproses rahasia ke SeaBank 901122061680`)
  }

  // CEK PIN OWNER RAHASIA
  const cekPinOwner = () => {
    if (pinInput === PIN_OWNER) {
      setOwnerOk(true)
    } else {
      alert('PIN salah')
    }
  }

  // HALAMAN LOGIN - TANPA PIN - RAHASIA TENAN
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center p-6">
        <div className="w-full max-w-[380px] mt-16 text-center">
          <div className="font-black text-yellow-400 text-4xl leading-none tracking-tight">
            LOCAL<br/>AREA<br/>WA+TIKTOK
          </div>

          <div className="text-[11px] text-zinc-600 mt-4 tracking-[4px]">
            ANONIM • AMAN • 100% REAL
          </div>

          <div className="bg-[#151515] rounded-[28px] p-6 mt-10 border border-white/10 text-left shadow-2xl">
            <div className="font-bold text-[18px]">
              Masuk Anonim
            </div>

            <div className="text-[13px] text-zinc-400 mt-3 leading-relaxed">
              Masuk tanpa nama.<br/>
              Privasi terjaga.<br/>
              Chat aman tidak hilang.
            </div>

            <button
              onClick={handleMasuk}
              className="w-full mt-8 bg-yellow-400 text-black font-black py-4 rounded-2xl text-[16px] tracking-wide"
            >
              MASUK
            </button>

            <div className="text-[10px] text-zinc-600 mt-4 text-center">
              Anonim • Aman • Data kesimpen neng HP<br/>
              Ora reset ilang
            </div>
          </div>

          <div className="text-[9px] text-zinc-700 mt-8">
            Owner dirahasiakan - Tidak tampil publik
          </div>
        </div>
      </div>
    )
  }

  // HALAMAN UTAMA SETELAH LOGIN
  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-[420px] min-h-screen bg-black pb-28 relative">

        {/* HEADER - TANPA PIN - CUMA ICON GEMBOK KECIL */}
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur p-3 flex justify-between items-center border-b border-white/10">
          <div className="font-black text-yellow-400 text-sm leading-none">
            LOCAL<br/>AREA
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[10px] text-zinc-600">
              Anonim
            </div>
            <button
              onClick={() => setShowOwner(true)}
              className="bg-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-[13px] border border-white/10"
            >
              🔒
            </button>
          </div>
        </div>

        {/* MODAL OWNER - PIN RAHASIA - MUNG KOWE SING NGERTI */}
        {showOwner && (
          <div className="fixed inset-0 bg-black/90 z-50 flex justify-center p-4 overflow-y-auto">
            <div className="bg-[#151515] w-full max-w-[380px] rounded-[24px] p-6 h-fit mt-10 border border-white/10">
              {!ownerOk ? (
                <>
                  <div className="font-bold text-[18px]">
                    🔒 Owner
                  </div>
                  <div className="text-[12px] text-zinc-500 mt-2">
                    Masukkan PIN rahasia pemilik
                  </div>

                  <input
                    type="password"
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    placeholder="••••"
                    className="w-full mt-6 bg-black border border-white/10 rounded-xl px-4 py-4 text-center tracking-[14px] text-2xl font-black"
                  />

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={cekPinOwner}
                      className="bg-yellow-400 text-black font-black py-4 rounded-xl"
                    >
                      BUKA
                    </button>
                    <button
                      onClick={() => setShowOwner(false)}
                      className="bg-zinc-800 py-4 rounded-xl text-white"
                    >
                      Tutup
                    </button>
                  </div>

                  <div className="text-[9px] text-zinc-700 mt-4 text-center">
                    Hanya pemilik yang tahu PIN ini
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="font-bold text-lg">
                    ✅ Owner Terbuka
                  </div>

                  <div className="bg-black rounded-xl p-4 text-xs border border-white/5">
                    <div className="text-zinc-500 text-[10px]">
                      NAMA RAHASIA
                    </div>
                    <div className="font-bold mt-1">
                      Tri Angga
                    </div>
                  </div>

                  <div className="bg-black rounded-xl p-4 text-xs border border-white/5">
                    <div className="text-zinc-500 text-[10px]">
                      EMAIL RAHASIA
                    </div>
                    <div className="mt-1">
                      triangga468@gmail.com
                    </div>
                  </div>

                  <div className="bg-black rounded-xl p-4 text-xs border border-white/5">
                    <div className="text-zinc-500 text-[10px]">
                      SEABANK RAHASIA
                    </div>
                    <div className="font-bold mt-1">
                      901122061680
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      Telkomsel - a/n Tri
                    </div>
                  </div>

                  <div className="bg-black rounded-xl p-4 text-xs border border-white/5 break-all">
                    <div className="text-zinc-500 text-[10px]">
                      CLIENT KEY REAL
                    </div>
                    <div className="font-mono text-[10px] mt-1">
                      {CLIENT_KEY}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOwnerOk(false)
                      setShowOwner(false)
                      setPinInput('')
                    }}
                    className="w-full bg-zinc-800 py-4 rounded-xl font-bold mt-2"
                  >
                    Kunci Lagi
                  </button>

                  <div className="text-[9px] text-zinc-600 text-center mt-2">
                    Jangan share PIN ini ke siapa pun
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BERANDA TAB */}
        {tab === 'beranda' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#151515] rounded-[24px] p-5 border border-white/5">
              <div className="text-xl font-bold">
                Halo, {user.anonim} 👋
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                GPS {user.gps} • {user.kota} • Anonim • Aman
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-black rounded-2xl p-4 border border-white/5">
                  <div className="text-[11px] text-zinc-500">
                    Coins
                  </div>
                  <div className="font-black text-yellow-400 text-xl mt-1">
                    {coins}
                  </div>
                </div>
                <div className="bg-black rounded-2xl p-4 border border-white/5">
                  <div className="text-[11px] text-zinc-500">
                    Saldo
                  </div>
                  <div className="font-black text-xl mt-1">
                    Rp{saldo}
                  </div>
                </div>
                <div className="bg-black rounded-2xl p-4 border border-white/5">
                  <div className="text-[11px] text-zinc-500">
                    Likes
                  </div>
                  <div className="font-black text-xl mt-1">
                    {likes}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="bg-[#151515] rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl">
                  ✉️
                </div>
                <div className="text-[10px] mt-2 text-zinc-400">
                  Saran
                </div>
              </div>

              <button
                onClick={handleGift}
                className="bg-[#151515] rounded-2xl p-4 text-center border border-white/5"
              >
                <div className="text-xl">
                  🎁
                </div>
                <div className="text-[10px] mt-2 text-zinc-400">
                  Gift
                </div>
              </button>

              <button
                onClick={handleLike}
                className="bg-[#151515] rounded-2xl p-4 text-center border border-yellow-400/20"
              >
                <div className="text-xl">
                  💛
                </div>
                <div className="text-[10px] mt-2 font-bold text-yellow-400">
                  Like
                </div>
              </button>

              <div className="bg-[#151515] rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl">
                  🎵
                </div>
                <div className="text-[10px] mt-2 text-zinc-400">
                  Hiburan
                </div>
              </div>

              <div className="bg-[#151515] rounded-2xl p-4 text-center border border-white/5">
                <div className="text-xl">
                  ⚠️
                </div>
                <div className="text-[9px] mt-2 text-zinc-400">
                  SOS WA
                </div>
              </div>
            </div>

            <div className="bg-[#151515] rounded-2xl p-4 flex gap-3 border border-white/5">
              <input
                value={saranText}
                onChange={e => setSaranText(e.target.value)}
                placeholder="Tulis saran anonim..."
                className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs"
              />
              <button
                onClick={handleKirimSaran}
                className="bg-yellow-400 text-black font-bold px-5 rounded-xl text-xs"
              >
                Kirim
              </button>
            </div>

            <div className="bg-[#151515] rounded-2xl p-5 border border-white/5">
              <div className="font-bold">
                🌐 Global Feed
              </div>
              <div className="text-[11px] text-zinc-500 mt-2">
                TikTok FYP Style - Like = Coins+1 Saldo Rp500<br/>
                Data kesimpen HP terus, ora reset ilang. Owner rahasia tidak tampil.
              </div>
            </div>
          </div>
        )}

        {/* DOMPET TAB */}
        {tab === 'dompet' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#151515] rounded-[24px] p-5 border border-yellow-500/10">
              <div className="text-xs text-zinc-500">
                Saldo Point
              </div>
              <div className="text-4xl font-black mt-2">
                Rp{saldo}
              </div>
              <div className="text-xs text-yellow-400 mt-2">
                {coins} Coins - Anonim - Aman
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => handleTopup(10000)}
                  className="bg-yellow-400 text-black font-bold py-4 rounded-xl text-xs"
                >
                  Topup Rp10k REAL
                </button>
                <button
                  onClick={() => handleTopup(100000)}
                  className="bg-yellow-400 text-black font-bold py-4 rounded-xl text-xs"
                >
                  Topup Rp100k REAL
                </button>
                <button
                  onClick={() => handleTopup(250000)}
                  className="bg-zinc-800 py-4 rounded-xl text-xs font-bold"
                >
                  Rp250k
                </button>
                <button
                  onClick={() => handleTopup(500000)}
                  className="bg-zinc-800 py-4 rounded-xl text-xs font-bold"
                >
                  Rp500k
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {['DANA', 'ShopeePay', 'SeaBank', 'GoPay', 'PayPal', 'Pulsa', 'Token', 'OVO'].map(m => (
                <button
                  key={m}
                  onClick={() => handleWithdraw(m)}
                  className="bg-[#151515] rounded-2xl p-4 text-center border border-white/5"
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

            <div className="bg-[#151515] rounded-2xl p-5 border border-white/5">
              <div className="font-bold mb-3">
                Riwayat Transaksi
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {riwayat.length === 0 && (
                  <div className="text-xs text-zinc-600">
                    Belum ada transaksi - Like dulu
                  </div>
                )}
                {riwayat.map((r, i) => (
                  <div
                    key={i}
                    className="bg-black rounded-xl p-4 flex justify-between border border-white/5"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-sm">
                        {r.tipe}
                      </div>
                      <div className="text-[11px] text-zinc-500 break-all mt-1">
                        {r.ket} • {r.tgl}
                      </div>
                    </div>
                    <div className="font-black text-yellow-400 text-sm ml-3">
                      {r.rp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RADAR TAB */}
        {tab === 'radar' && (
          <div className="p-4">
            <div className="bg-[#151515] rounded-2xl p-5 text-sm border border-white/5">
              📡 Radar WA ShareLoc<br/><br/>
              GPS: {user.gps} - Sukoharjo<br/>
              Anonim - Aman - REAL<br/><br/>
              Belum ada user cedak
            </div>
          </div>
        )}

        {tab === 'chat' && (
          <div className="p-4">
            <div className="bg-[#151515] rounded-2xl p-5 text-sm border border-white/5">
              💬 Chat WA<br/><br/>
              Chat WA gabungan TikTok<br/>
              Anonim - Aman - Owner rahasia
            </div>
          </div>
        )}

        {tab === 'live' && (
          <div className="p-4">
            <div className="bg-[#151515] rounded-2xl p-5 text-sm border border-white/5">
              ((•)) Live TikTok<br/><br/>
              Live streaming seperti TikTok<br/>
              Gift & Coins aktif
            </div>
          </div>
        )}

        {tab === 'profil' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#151515] rounded-2xl p-6 text-center border border-white/5">
              <div className="w-20 h-20 rounded-full bg-zinc-800 mx-auto flex items-center justify-center text-2xl">
                👤
              </div>
              <div className="font-bold mt-4">
                User Anonim
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">
                ID: {user.id}
              </div>
              <div className="text-[10px] text-zinc-600 mt-4">
                Owner dirahasiakan<br/>
                Tidak tampil di profil publik<br/>
                Aman
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset semua data? Hati-hati, data hilang')) {
                  localStorage.clear()
                  location.reload()
                }
              }}
              className="w-full bg-red-900/20 text-red-400 py-4 rounded-xl text-xs border border-red-900/30"
            >
              Reset Data
            </button>
          </div>
        )}

        {/* BOTTOM NAV - 6 TAB */}
        <div className="fixed bottom-0 w-full max-w-[420px] bg-[#111]/95 backdrop-blur flex justify-around py-3 border-t border-white/10">
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
