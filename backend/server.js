const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Where scores are saved (a JSON file)
const FILE = path.join(__dirname, 'data', 'scores.json');

function readScores() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    return { X: 0, O: 0, draws: 0 };
  }
}

function writeScores(scores) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(scores, null, 2));
}

// GET the scoreboard
app.get('/api/scores', (req, res) => {
  res.json(readScores());
});

// POST a game result: { "winner": "X" } or "O" or "draw"
app.post('/api/result', (req, res) => {
  const { winner } = req.body;
  const scores = readScores();
  if (winner === 'X') scores.X++;
  else if (winner === 'O') scores.O++;
  else if (winner === 'draw') scores.draws++;
  else return res.status(400).json({ error: 'Invalid winner' });
  writeScores(scores);
  res.json(scores);
});

// POST reset the scoreboard
app.post('/api/reset', (req, res) => {
  const scores = { X: 0, O: 0, draws: 0 };
  writeScores(scores);
  res.json(scores);
});

// In production, also serve the React website from this server
const dist = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
