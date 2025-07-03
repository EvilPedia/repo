import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { token } = req.query;
  try {
    jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const filePath = path.join(process.cwd(), 'private', 'your-secret.jpg');
  try {
    const imageBuffer = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.status(200).send(imageBuffer);
  } catch (err) {
    res.status(404).json({ error: 'Image not found' });
  }
}