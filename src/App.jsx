// TARUH DI ATAS
const OWNER_EMAIL = "triangga406@gmail.com";
const isOwner = currentUser?.email === OWNER_EMAIL;

// GANTI FUNGSI TARIK KAMU JADI INI
async function handleTarikDana(jumlah, noSeaBank) {
  // JIKA OWNER - JANGAN CEK SALDO
  if(isOwner){
    alert("MAHA APK AKTIF - Tarik tanpa top up!");
    // langsung tembak ke backend
    const res = await fetch('/api/withdraw-owner', {
      method: 'POST',
      body: JSON.stringify({ 
        amount: jumlah, 
        bank: "SEABANK",
        account: noSeaBank,
        ownerEmail: OWNER_EMAIL 
      })
    });
    const data = await res.json();
    alert(`BERHASIL CAIR Rp ${jumlah} ke SeaBank ${noSeaBank}`);
    return;
  }

  // JIKA USER BIASA - TETAP CEK SALDO
  if(saldo < jumlah){
    alert("Saldo tidak cukup, top up dulu");
    return;
  }
  // proses biasa...
}
