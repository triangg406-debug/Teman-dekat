export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })
  const { amount, mode, ownerEmail } = req.body
  const OWNER_EMAIL = 'triangg406@gmail.com'
  if (ownerEmail !== OWNER_EMAIL) return res.status(403).json({ message: 'Hanya pemilik' })
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  try {
    const { data: owner } = await supabase.from('profiles').select('id, saldo').eq('email', OWNER_EMAIL).single()
    if (!owner) return res.status(404).json({ message: 'Profile owner belum ada' })
    let newSaldo = mode === 'set' ? Number(amount) : (owner.saldo || 0) + Number(amount)
    await supabase.from('profiles').update({ saldo: newSaldo }).eq('id', owner.id)
    return res.status(200).json({ success: true, newSaldo })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}
