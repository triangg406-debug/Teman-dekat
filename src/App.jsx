import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// --- SETTING AMAN ---
// Email pemilik TIDAK ADA di sini lagi, cek via database
const PLATFORM_FEE_PERCENT = 5;

export default function App() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [page, setPage] = useState("Beranda");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cek user login & cek apakah owner (aman dari server)
  useEffect(() => {
    const initApp = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        // 1. Cek owner lewat function is_owner di Supabase (bukan email hardcoded)
        const { data: ownerStatus } = await supabase.rpc('is_owner');
        setIsOwner(ownerStatus === true);

        // 2. Ambil data coins & saldo
        const { data } = await supabase
          .from('profiles')
          .select('coins, saldo')
          .eq('id', currentUser.id)
          .single();
        
        if (data) {
          setCoins(data.coins || 0);
          setSaldo(data.saldo || 0);
        }
      }
      setLoading(false);
    };

    initApp();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="font-bold text-lg">Teman-dekat</h1>
        <div className="text-sm">
          {user ? `${coins} Coins | Rp ${saldo}` : "Belum login"}
          {isOwner && <span className="ml-2 bg-black text-white px-2 py-1 rounded text-xs">OWNER</span>}
        </div>
      </header>

      {/* Content Page */}
      <main className="p-4">
        {page === "Beranda" && (
          <div>
            <h2 className="text-xl font-semibold">Beranda</h2>
            <p className="text-gray-600 mt-2">Selamat datang {user?.email}</p>
            {isOwner ? (
              <div className="mt-4 p-3 bg-yellow-100 rounded">
                <p>Panel Owner Aktif - Fee {PLATFORM_FEE_PERCENT}% dihitung di server</p>
              </div>
            ) : (
              <div className="mt-4">Konten untuk user biasa</div>
            )}
          </div>
        )}
        {/* Tambahkan page lain kamu di sini sesuai kode lama kamu */}
      </main>

      {/* Navigasi Bawah */}
      <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3">
        <button onClick={() => setPage("Beranda")}>Beranda</button>
        <button onClick={() => setPage("Profil")}>Profil</button>
        {isOwner && <button onClick={() => setPage("Admin")}>Admin</button>}
      </nav>
    </div>
  );
}
