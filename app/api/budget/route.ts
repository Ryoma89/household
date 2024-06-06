import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, month, amount } = req.body;

  if (req.method === 'POST') {
    const { data, error } = await supabase
      .from('budgets')
      .upsert({ user_id: userId, month, amount });

    if (error) return res.status(400).json({ error });

    return res.status(200).json(data);
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month);

    if (error) return res.status(400).json({ error });

    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
