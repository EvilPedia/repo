import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // Check for a secret token in the query string
  const { token } = req.query;
  if (token !== process.env.SECRET_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const filePath = path.join(process.cwd(), 'private', 'your-secret.jpg');
  try {
    const imageBuffer = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
  } catch (err) {
    res.status(404).json({ error: 'Image not found' });
  }
}