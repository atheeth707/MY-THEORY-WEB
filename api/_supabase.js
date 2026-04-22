import supabase from './_supabase.js';

export default async function handler(req, res) {
  // CORS (safe)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      // 🔥 Always get latest row (important fix)
      const { data, error } = await supabase
        .from('research_about')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // safer than .single()

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Database error',
          details: error.message,
        });
      }

      if (!data) {
        return res.status(404).json({
          error: 'No data found in research_about table',
        });
      }

      // ✅ Success response
      return res.status(200).json(data);
    }

    // ❌ Method not allowed
    return res.status(405).json({
      error: 'Method not allowed',
    });

  } catch (err) {
    console.error('API crash:', err);

    return res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
}