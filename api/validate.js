import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const submittedPassword = req.body?.password;
  const correctPassword = process.env.SECRET_PASSWORD;

  if (submittedPassword === correctPassword) {
    // Create a JWT valid for 5 minutes
    const token = jwt.sign({ access: 'secret-image' }, process.env.SECRET_TOKEN, { expiresIn: '5m' });
    res.status(200).json({ valid: true, token });
  } else {
    res.status(401).json({ valid: false });
  }

  console.log('Submitted:', submittedPassword, 'Expected:', correctPassword);
}
