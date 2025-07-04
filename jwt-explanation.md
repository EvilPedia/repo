# JWT (JSON Web Tokens) Explanation

## 🏗️ Structure of a JWT

A JWT looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJzZWNyZXQtaW1hZ2UiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMDMwMH0.signature_here
```

### Part 1: Header (Red)
```json
{
  "alg": "HS256",    // Algorithm used for signing
  "typ": "JWT"       // Token type
}
```

### Part 2: Payload (Purple) 
```json
{
  "access": "secret-image",    // Custom claim - what they can access
  "iat": 1700000000,          // Issued at time (timestamp)
  "exp": 1700000300           // Expires at time (timestamp)
}
```

### Part 3: Signature (Blue)
A cryptographic signature that proves the token hasn't been tampered with.

## 🔄 How It Works in Your Project

### Step 1: User Logs In
```javascript
// User enters password
const response = await fetch('/api/validate', {
  method: 'POST',
  body: JSON.stringify({ password: userInput })
});
```

### Step 2: Server Creates JWT
```javascript
// In /api/validate.js
if (submittedPassword === correctPassword) {
  const token = jwt.sign(
    { access: 'secret-image' },           // Payload: what they can access
    process.env.SECRET_TOKEN,             // Secret key (only server knows)
    { expiresIn: '5m' }                   // Expires in 5 minutes
  );
  res.json({ token });
}
```

### Step 3: Client Uses Token
```javascript
// Client includes token when requesting protected files
const imageUrl = `/api/protected-file?file=your-secret.jpg&token=${token}`;
```

### Step 4: Server Verifies Token
```javascript
// In /api/protected-file.js
try {
  jwt.verify(token, process.env.SECRET_TOKEN);  // Verify signature & expiration
  // If valid, serve the file
} catch (err) {
  return res.status(403).json({ error: 'Forbidden' });
}
```

## 🛡️ Security Features

### 1. **Cryptographic Signature**
- The signature is created using your `SECRET_TOKEN` environment variable
- If someone changes the payload, the signature becomes invalid
- Only your server can create valid tokens

### 2. **Expiration Time**
- Tokens automatically expire after 5 minutes
- Even if stolen, they become useless quickly
- Forces users to re-authenticate periodically

### 3. **Stateless**
- Server doesn't need to store active sessions
- All information is contained in the token
- Scales better than traditional sessions

## 🕐 Timeline Example

```
12:00:00 - User enters correct password
12:00:01 - Server creates JWT (expires at 12:05:01)
12:00:02 - User accesses secret image ✅ (token valid)
12:02:30 - User accesses image again ✅ (token still valid)
12:05:02 - User tries to access image ❌ (token expired)
12:05:03 - User must enter password again
```

## 🔍 What Makes It Secure?

### ✅ **Cannot Be Forged**
```javascript
// This won't work - signature will be invalid
const fakeToken = "header.{hacker_payload}.fake_signature";
```

### ✅ **Cannot Be Modified**
```javascript
// If someone changes the expiration time, signature becomes invalid
// Original: { "exp": 1700000300 }
// Hacked:   { "exp": 9999999999 } ← Signature won't match
```

### ✅ **Time-Limited**
- Even if someone steals a token, it expires in 5 minutes
- No way to extend expiration without the secret key

## 🆚 JWT vs Traditional Sessions

| JWT | Traditional Sessions |
|-----|---------------------|
| Stateless (server stores nothing) | Stateful (server stores session data) |
| Self-contained | Requires database lookup |
| Can't be revoked easily | Can be revoked immediately |
| Works across multiple servers | Tied to specific server |

## 🚨 Important Security Notes

### Your `SECRET_TOKEN` Environment Variable
```bash
SECRET_TOKEN=your-super-secret-key-here
```
- This is like the master key
- If someone gets this, they can create fake tokens
- Keep it secret and make it long/random

### Token Storage
- Currently stored in JavaScript variables (memory)
- Cleared when page refreshes ✅
- Not stored in localStorage (good for security)

## 🔧 How to Test JWT

You can decode (but not verify) JWTs at [jwt.io](https://jwt.io) to see the contents:

1. Copy a token from your browser's network tab
2. Paste it into jwt.io
3. See the header and payload decoded
4. The signature verification will fail (they don't have your secret)

## 💡 Why This Approach is Perfect for Your Use Case

1. **Simple**: No complex session management
2. **Secure**: Time-limited access tokens
3. **Scalable**: Works on serverless platforms like Vercel
4. **Stateless**: No database needed for session storage
5. **Automatic cleanup**: Expired tokens are automatically invalid