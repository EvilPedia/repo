import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.json'];
const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.json': 'application/json'
};

export default function handler(req, res) {
  const { file, token } = req.query;
  
  // Verify JWT token
  try {
    jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden - Invalid or expired token' });
  }

  if (!file) {
    return res.status(400).json({ error: 'File parameter is required' });
  }

  // Security: Prevent path traversal attacks
  const sanitizedFile = path.normalize(file).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(process.cwd(), 'private', sanitizedFile);
  
  // Ensure the file is within the private directory
  const privateDir = path.join(process.cwd(), 'private');
  if (!filePath.startsWith(privateDir)) {
    return res.status(403).json({ error: 'Access denied - Invalid file path' });
  }

  // Check if file extension is allowed
  const ext = path.extname(filePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return res.status(403).json({ error: 'File type not allowed' });
  }

  try {
    // Check if file exists and read it
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).send(fileBuffer);
  } catch (err) {
    console.error('Error serving protected file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}