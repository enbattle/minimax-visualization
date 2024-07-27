import { Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css'],
})
export class TicTacToeComponent {
  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  aiPlayer = 'X';
  humanPlayer = 'O';
  currentPlayer = this.humanPlayer;
  gameOver = false;
  message = '';

  // Check the board to see if there is a winner
  checkWinner(board: string[][]): string | null {
    const winningCombinations = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const combination of winningCombinations) {
      if (
        combination[0] &&
        combination[0] === combination[1] &&
        combination[0] === combination[2]
      ) {
        return combination[0];
      }
    }

    if (board.flat().every((cell) => cell !== '')) {
      return 'draw';
    }

    return null;
  }

  // Recursive minimax function to calculate moves
  minimax(board: string[][], depth: number, isMaximizing: boolean): number {
    const winner = this.checkWinner(board);

    if (winner === this.aiPlayer) return 10 - depth;
    if (winner === this.humanPlayer) return depth - 10;
    if (winner === 'draw') return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = this.aiPlayer;
            const moveEval = this.minimax(board, depth + 1, false);
            board[i][j] = '';
            maxEval = Math.max(maxEval, moveEval);
          }
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            board[i][j] = this.humanPlayer;
            const moveEval = this.minimax(board, depth + 1, true);
            board[i][j] = '';
            minEval = Math.min(minEval, moveEval);
          }
        }
      }
      return minEval;
    }
  }

  // Find best possible moves using minimax algorithm
  findBestMove(): { row: number; col: number } {
    let bestVal = -Infinity;
    let bestMove = { row: -1, col: -1 };

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === '') {
          this.board[i][j] = this.aiPlayer;
          const moveVal = this.minimax(this.board, 0, false);
          this.board[i][j] = '';

          if (moveVal > bestVal) {
            bestMove = { row: i, col: j };
            bestVal = moveVal;
          }
        }
      }
    }

    return bestMove;
  }

  // Let the computer make their move on the board
  makeAIMove(): void {
    setTimeout(() => {
      const bestMove = this.findBestMove();
      if (bestMove.row !== -1 && bestMove.col !== -1) {
        this.board[bestMove.row][bestMove.col] = this.aiPlayer;
        this.checkGameOver();
        this.currentPlayer = this.humanPlayer;
      }
    }, 500); // Simulate thinking with a 0.5 second delay
  }

  // User move on the board
  handleClick(row: number, col: number): void {
    if (
      !this.gameOver &&
      this.board[row][col] === '' &&
      this.currentPlayer === this.humanPlayer
    ) {
      this.board[row][col] = this.humanPlayer;
      this.checkGameOver();
      if (!this.gameOver) {
        this.currentPlayer = this.aiPlayer;
        this.makeAIMove();
      }
    }
  }

  // Check game win conditions
  checkGameOver(): void {
    const winner = this.checkWinner(this.board);
    if (winner) {
      this.gameOver = true;
      if (winner === 'draw') {
        this.message = "It's a draw!";
      } else {
        this.message = `${winner} wins!`;
      }
    }
  }

  // Reset the game
  resetGame(): void {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.gameOver = false;
    this.message = '';
    this.currentPlayer = this.humanPlayer;
  }
}
