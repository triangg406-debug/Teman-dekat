export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  const { targetUserId, amount, ownerEmail } = req.body
  const OWNER_EMAIL = 'triangg406@gmail.com'
  if (ownerEmail !== OWNER_EMAIL) return res.status(403).json({ message: 'Hanya pemilik' })
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  try {
    const { data: target } = await supabase.from('profiles').select('id, saldo').eq('id', targetUserId).single()
    if (!target) return res.status(404).json({ message: 'User tidak ditemukan' })
    const newSaldo = (target.saldo || 0) + Number(amount)
    await supabase.from('profiles').update({ saldo: newSaldo }).eq('id', targetUserId)
    return res.status(200).json({ success: true, newSaldo, message: `Hadiah Rp ${Number(amount).toLocaleString('id-ID')} berhasil dikirim REAL` })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}
