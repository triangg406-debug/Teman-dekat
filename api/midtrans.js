import midtransClient from 'midtrans-client';
export default async function handler(req,res){
  const snap = new midtransClient.Snap({
    isProduction: true, // ganti false nek isih sandbox
    serverKey: process.env.MIDTRANS_SERVER_KEY
  });
  const { amount, user } = req.body;
  const parameter = {
    transaction_details: { order_id: 'TOPUP-'+Date.now(), gross_amount: amount },
    customer_details: { email: user },
  };
  const token = await snap.createTransactionToken(parameter);
  res.json({ token });
}
