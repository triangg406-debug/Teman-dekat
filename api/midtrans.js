import midtransClient from 'midtrans-client'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

export default async function handler(req, res) {
  const snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY
  });

  const { amount, user } = req.body; // user = email e
  const order_id = `LA-${Date.now()}`;
  
  const parameter = {
    transaction_details: { order_id, gross_amount: parseInt(amount) },
    customer_details: { email: user }
  };

  const token = await snap.createTransactionToken(parameter);
  
  // simpen ben webhook iso ng-update saldo
  await supabase.from('topup_transactions').insert({
    order_id, amount, status: 'pending'
  });

  res.json({ token, order_id });
}
