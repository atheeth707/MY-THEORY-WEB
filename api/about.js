import supabase from './_supabase.js';
export default async function handler(req, res) {
  return res.status(200).json({
    message: "API working",
    time: new Date().toISOString()
  });
}
