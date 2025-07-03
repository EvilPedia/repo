export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const submittedPassword = req.body?.password;
  const correctPassword = process.env.SECRET_PASSWORD;

  if (submittedPassword === correctPassword) {
    res.status(200).json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
}
