// ini yang hubungkan ke SeaBank beneran via FLIP / XENDIT
export default async function handler(req, res){
  const { amount, account } = req.body;
  
  // cek beneran pemilik atau bukan
  if(req.body.ownerEmail !== "triangga406@gmail.com"){
    return res.status(403).json({error: "Bukan pemilik"});
  }

  // DISINI BARU TEMBAK KE API FLIP / XENDIT UNTUK TRANSFER KE SEABANK
  // Kamu daftar dulu di flip.id / xendit.co, ambil API KEY nya
  // Contoh pakai Flip:
  // await fetch('https://bigflip.id/api/v2/disbursement', {...})

  console.log(`OWNER WITHDRAW ${amount} ke SeaBank ${account}`);
  
  res.json({success: true, message: "Dicairkan (Integrasikan Flip API disini)"});
}
