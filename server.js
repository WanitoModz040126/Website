const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  console.log('────────────────────────────');
  console.log(`Name    : ${name}`);
  console.log(`Email   : ${email}`);
  console.log(`Message : ${message}`);
  console.log('────────────────────────────');
  res.json({ success: true, message: 'Message received. We will get back to you soon.' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`WanitoModz Tool — server live on http://localhost:${PORT}`);
});