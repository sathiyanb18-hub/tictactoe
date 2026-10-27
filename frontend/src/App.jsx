import { useState, useEffect } from 'react'
import $ from 'jquery'
import Board from './components/Board'
import Scoreboard from './components/Scoreboard'

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function calcWinner(sq) {
  for (const [a, b, c] of LINES) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return { winner: sq[a], line: [a, b, c] }
    }
  }
  return null
}

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xTurn, setXTurn] = useState(true)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const result = calcWinner(squares)
  const isDraw = !result && squares.every(Boolean)
  const gameOver = !!result || isDraw

  let status = 'Next player: ' + (xTurn ? 'X' : 'O')
  if (result) status = 'Player ' + result.winner + ' wins! 🎉'
  else if (isDraw) status = "It's a draw! 🤝"

  // Load saved scores from the backend when the page opens
  useEffect(() => {
    fetch('/api/scores')
      .then((r) => r.json())
      .then(setScores)
      .catch(() => {})
  }, [])

  // jQuery: fade the status text whenever it changes
  useEffect(() => {
    $('#status').stop(true, true).hide().fadeIn(350)
  }, [status])

  // When the game ends: save result to backend + jQuery pulse on the board
  useEffect(() => {
    if (!gameOver) return
    fetch('/api/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner: result ? result.winner : 'draw' }),
    })
      .then((r) => r.json())
      .then(setScores)
      .catch(() => {})

    $('#board').addClass('pulse')
    setTimeout(() => $('#board').removeClass('pulse'), 600)
  }, [gameOver])

  function handleClick(i) {
    if (squares[i] || gameOver) return
    const next = squares.slice()
    next[i] = xTurn ? 'X' : 'O'
    setSquares(next)
    setXTurn(!xTurn)
  }

  function newGame() {
    setSquares(Array(9).fill(null))
    setXTurn(true)
  }

  function resetScores() {
    fetch('/api/reset', { method: 'POST' })
      .then((r) => r.json())
      .then(setScores)
    newGame()
  }

  return (
    <div className="container py-3">
      <div className="game-card text-center">
        <h1 className="title mb-3">Tic Tac Toe</h1>
        <div id="status" className="status mb-3">{status}</div>

        <Board squares={squares} onClick={handleClick} winLine={result ? result.line : null} />
        <Scoreboard scores={scores} />

        <div className="d-flex gap-2 justify-content-center mt-4">
          <button className="btn btn-light fw-bold px-4" onClick={newGame}>New Game</button>
          <button className="btn btn-outline-light px-4" onClick={resetScores}>Reset Scores</button>
        </div>
      </div>
    </div>
  )
}