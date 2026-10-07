import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  const { order_id, transaction_status, gross_amount } = req.body;

  if (transaction_status === 'settlement' || transaction_status === 'capture') {
    // update status transaksi
    await supabase.from('topup_transactions').update({ status: 'success' }).eq('order_id', order_id);
    
    // tambah saldo pemilik
    const { data } = await supabase.from('profiles').select('saldo').eq('email', 'pemilik@localarea.id').single();
    await supabase.from('profiles').update({ 
      saldo: (data?.saldo || 0) + parseInt(gross_amount) 
    }).eq('email', 'pemilik@localarea.id');
  }

  res.json({ ok: true });
}
