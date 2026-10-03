export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { amount, accountNumber, accountName } = req.body

  if (!accountNumber || !amount) {
    return res.status(400).json({ message: 'No rekening & nominal wajib' })
  }

  const XENDIT_KEY = process.env.XENDIT_SECRET_KEY

  try {
    const xenditRes = await fetch('https://api.xendit.co/disbursements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(XENDIT_KEY + ':').toString('base64')
      },
      body: JSON.stringify({
        external_id: `wd-${Date.now()}`,
        bank_code: 'SEABANK',
        account_holder_name: accountName,
        account_number: accountNumber,
        description: 'WD teman-dekat-ggjq',
        amount: Number(amount)
      })
    })

    const result = await xenditRes.json()

    if (!xenditRes.ok) {
      return res.status(400).json({ message: result.message || 'Gagal disbursement', detail: result })
    }

    return res.status(200).json({ 
      id: result.id,
      status: result.status,
      amount: result.amount,
      message: 'WD REAL BERHASIL DIPROSES KE SEABANK'
    })

  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}
