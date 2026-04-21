import supabase from './_supabase.js';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('research_about')
    .select('*');

  return res.status(200).json({
    data,
    count: data?.length
  });
}