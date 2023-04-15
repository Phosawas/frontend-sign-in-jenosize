import { useState } from "react";

function XOGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (winner || board[index]) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setPlayer(player === 'X' ? 'O' : 'X');
      calculateBotMove(newBoard);
    }
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== null)) {
      return 'tie';
    }

    return null;
  };

  const calculateBotMove = (board) => {
    fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board: board, player: 'O' }),
    })
      .then((response) => response.json())
      .then((data) => {
        const newBoard = data.board;
        setBoard(newBoard);

        const newWinner = calculateWinner(newBoard);
        if (newWinner) {
          setWinner(newWinner);
        } else {
          setPlayer('X');
        }
      })
      .catch((error) => console.error(error));
  };

  const renderSquare = (index) => {
    return (
      <button className="square" style={{ height: '20px', width: '120px' }} onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  let status;
  if (winner) {
    status = winner === 'tie' ? 'It\'s a tie!' : `Winner: ${winner}`;
  } else {
    status = `Next player: ${player}`;
  }

  const onReset = () => {
    setBoard(Array(9).fill(null))
    setPlayer('X')
    setWinner(null)
  }

  return (
    <div className="game-board">
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button onClick={onReset}>reset</button>
    </div>
  );
}

export default XOGame;