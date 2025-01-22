import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type SquareValue = 'X' | 'O' | null;

function Square({ value, onClick, highlight }: { 
  value: SquareValue; 
  onClick: () => void;
  highlight: boolean;
}) {
  return (
    <button
      className={`w-14 h-14 border-2 border-gray-300 text-2xl font-bold flex items-center justify-center
        transition-all duration-200 hover:bg-gray-100 ${highlight ? 'bg-green-200' : 'bg-white'} 
        ${value === 'X' ? 'text-blue-600' : 'text-red-600'}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares: SquareValue[]): [SquareValue, number[]] | null {
  const BOARD_SIZE = 5;
  const WIN_LENGTH = 5;

  // Check horizontal lines
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_LENGTH; col++) {
      const startIndex = row * BOARD_SIZE + col;
      const line = Array.from({ length: WIN_LENGTH }, (_, i) => startIndex + i);
      if (checkLine(squares, line)) {
        return [squares[startIndex], line];
      }
    }
  }

  // Check vertical lines
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
      const startIndex = row * BOARD_SIZE + col;
      const line = Array.from({ length: WIN_LENGTH }, (_, i) => startIndex + i * BOARD_SIZE);
      if (checkLine(squares, line)) {
        return [squares[startIndex], line];
      }
    }
  }

  // Check diagonal lines (top-left to bottom-right)
  for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_LENGTH; col++) {
      const startIndex = row * BOARD_SIZE + col;
      const line = Array.from({ length: WIN_LENGTH }, (_, i) => startIndex + i * BOARD_SIZE + i);
      if (checkLine(squares, line)) {
        return [squares[startIndex], line];
      }
    }
  }

  // Check diagonal lines (top-right to bottom-left)
  for (let row = 0; row <= BOARD_SIZE - WIN_LENGTH; row++) {
    for (let col = WIN_LENGTH - 1; col < BOARD_SIZE; col++) {
      const startIndex = row * BOARD_SIZE + col;
      const line = Array.from({ length: WIN_LENGTH }, (_, i) => startIndex + i * BOARD_SIZE - i);
      if (checkLine(squares, line)) {
        return [squares[startIndex], line];
      }
    }
  }

  return null;
}

function checkLine(squares: SquareValue[], line: number[]): boolean {
  const firstValue = squares[line[0]];
  if (!firstValue) return false;
  return line.every(index => squares[index] === firstValue);
}

function App() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(25).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  const winner = calculateWinner(squares);
  const gameEnded = winner || squares.every(square => square !== null);

  const handleClick = (i: number) => {
    if (squares[i] || calculateWinner(squares)) return;

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    const result = calculateWinner(newSquares);
    if (result) {
      setWinningLine(result[1]);
    }
  };

  const resetGame = () => {
    setSquares(Array(25).fill(null));
    setXIsNext(true);
    setWinningLine([]);
  };

  const status = winner
    ? `Winner: ${winner[0]}`
    : squares.every(square => square !== null)
    ? "It's a draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Connect Five</h1>
        
        <div className="mb-4">
          <div className="text-xl font-semibold text-gray-700 text-center">
            {status}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {squares.map((square, i) => (
            <Square
              key={i}
              value={square}
              highlight={winningLine.includes(i)}
              onClick={() => handleClick(i)}
            />
          ))}
        </div>

        <button
          onClick={resetGame}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg 
            hover:bg-blue-700 transition-colors duration-200 flex items-center 
            justify-center gap-2 font-semibold"
        >
          <RotateCcw size={20} />
          Reset Game
        </button>
      </div>
    </div>
  );
}

export default App;