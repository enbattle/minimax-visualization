import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// @Component({
//   selector: 'app-connect-five',
//   templateUrl: './connect-five.component.html',
//   styleUrls: ['./connect-five.component.css'],
// })

@Component({
  selector: 'app-connect-five',
  templateUrl: './connect-five.component.html',
  styleUrls: ['./connect-five.component.css'],
})
export class ConnectFiveComponent implements OnInit {
  board: (string | null)[][];
  currentPlayer: string;
  winner: string | null;
  maxDepth: number;
  isThinking: boolean;
  highlightedCells: { row: number; col: number }[];

  constructor(private cdr: ChangeDetectorRef) {
    this.maxDepth = 3; // Initial depth limit
    this.isThinking = false;
    this.board = Array(15)
      .fill(null)
      .map(() => Array(15).fill(null));
    this.currentPlayer = 'black';
    this.winner = null;
    this.highlightedCells = [];
  }

  ngOnInit(): void {
    this.resetGame();
  }

  /**
   * Resets the game to its initial state.
   */
  resetGame(): void {
    this.board = Array(15)
      .fill(null)
      .map(() => Array(15).fill(null));
    this.currentPlayer = 'black';
    this.winner = null;
    this.isThinking = false;
    this.highlightedCells = [];
    this.clearHighlights();
  }

  /**
   * Returns the class name for the cell at the given position.
   */
  getCellClass(row: number, col: number): string | null {
    let cellClass = this.board[row][col];
    if (
      this.highlightedCells.some((cell) => cell.row === row && cell.col === col)
    ) {
      cellClass += ' highlight';
    }
    return cellClass;
  }

  /**
   * Handles the player's move.
   */
  makeMove(row: number, col: number): void {
    if (this.board[row][col] || this.winner || this.isThinking) {
      return;
    }
    this.board[row][col] = this.currentPlayer;
    if (this.checkWin(row, col)) {
      this.winner = this.currentPlayer;
    } else {
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
      if (this.currentPlayer === 'white') {
        this.computerMove();
      }
    }
  }

  /**
   * Handles the computer's move using the minimax algorithm.
   */
  async computerMove(): Promise<void> {
    this.isThinking = true;
    this.clearHighlights();
    let bestScore = -Infinity;
    let move: { row: number; col: number } | undefined;
    let possibleMoves = this.getPossibleMoves(this.board);

    // Iterative deepening with a time limit
    const startTime = performance.now();
    let timeLimit = 3000; // 3 seconds time limit

    for (let depth = 1; depth <= this.maxDepth; depth++) {
      for (let m of possibleMoves) {
        this.highlightedCells.push(m); // Keep track of highlighted cells
        this.highlightCell(m.row, m.col); // Highlight the current move being considered
        await this.delay(1); // Wait for 50ms to visualize the process faster
        this.board[m.row][m.col] = 'white';
        let score = this.minimax(
          this.board,
          0,
          false,
          -Infinity,
          Infinity,
          depth
        );
        this.board[m.row][m.col] = null;
        if (score > bestScore) {
          bestScore = score;
          move = m;
        }
      }
      if (performance.now() - startTime > timeLimit) {
        break; // Exit if time limit is reached
      }
    }

    if (move) {
      this.board[move.row][move.col] = 'white';
      if (this.checkWin(move.row, move.col)) {
        this.winner = 'white';
      }
      this.currentPlayer = 'black';
    }

    this.clearHighlights(); // Clear the highlights after move
    this.highlightedCells = []; // Clear the highlighted cells array
    this.isThinking = false;
    this.cdr.detectChanges(); // Trigger change detection
  }

  /**
   * Delay function to create a pause.
   */
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Minimax algorithm with alpha-beta pruning.
   */
  minimax(
    board: (string | null)[][],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    maxDepth: number
  ): number {
    if (this.checkWinCondition(board, 'white')) {
      return 10 - depth;
    }
    if (this.checkWinCondition(board, 'black')) {
      return depth - 10;
    }
    if (this.isBoardFull(board) || depth === maxDepth) {
      return this.evaluateBoard(board);
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      let possibleMoves = this.getPossibleMoves(board);
      for (let m of possibleMoves) {
        board[m.row][m.col] = 'white';
        let score = this.minimax(
          board,
          depth + 1,
          false,
          alpha,
          beta,
          maxDepth
        );
        board[m.row][m.col] = null;
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          break;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      let possibleMoves = this.getPossibleMoves(board);
      for (let m of possibleMoves) {
        board[m.row][m.col] = 'black';
        let score = this.minimax(board, depth + 1, true, alpha, beta, maxDepth);
        board[m.row][m.col] = null;
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);
        if (beta <= alpha) {
          break;
        }
      }
      return bestScore;
    }
  }

  /**
   * Evaluates the board and returns a score.
   */
  evaluateBoard(board: (string | null)[][]): number {
    let score = 0;
    score += this.evaluateLines(board, 'white');
    score -= this.evaluateLines(board, 'black');
    return score;
  }

  /**
   * Evaluates lines for a specific player.
   */
  evaluateLines(board: (string | null)[][], player: string): number {
    let score = 0;

    // Check all rows
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j <= 10; j++) {
        score += this.evaluateLine(board, player, i, j, 0, 1);
      }
    }

    // Check all columns
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j < 15; j++) {
        score += this.evaluateLine(board, player, i, j, 1, 0);
      }
    }

    // Check all diagonals (top-left to bottom-right)
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        score += this.evaluateLine(board, player, i, j, 1, 1);
      }
    }

    // Check all diagonals (bottom-left to top-right)
    for (let i = 4; i < 15; i++) {
      for (let j = 0; j <= 10; j++) {
        score += this.evaluateLine(board, player, i, j, -1, 1);
      }
    }

    return score;
  }

  /**
   * Evaluates a single line of 5 cells.
   */
  evaluateLine(
    board: (string | null)[][],
    player: string,
    row: number,
    col: number,
    deltaX: number,
    deltaY: number
  ): number {
    let count = 0;
    let emptyCount = 0;

    for (let i = 0; i < 5; i++) {
      const currentRow = row + i * deltaX;
      const currentCol = col + i * deltaY;

      if (board[currentRow][currentCol] === player) {
        count++;
      } else if (board[currentRow][currentCol] === null) {
        emptyCount++;
      } else {
        return 0;
      }
    }

    if (count === 5) {
      return 1000000;
    } else if (count === 4 && emptyCount === 1) {
      return 1000;
    } else if (count === 3 && emptyCount === 2) {
      return 100;
    } else if (count === 2 && emptyCount === 3) {
      return 10;
    } else if (count === 1 && emptyCount === 4) {
      return 1;
    }

    return 0;
  }

  /**
   * Generates and orders possible moves based on heuristic evaluation.
   */
  getPossibleMoves(board: (string | null)[][]): { row: number; col: number }[] {
    let moves: { row: number; col: number }[] = [];
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (board[i][j] === null) {
          moves.push({ row: i, col: j });
        }
      }
    }
    // Order moves based on heuristic
    moves.sort((a, b) => {
      board[a.row][a.col] = 'white';
      let scoreA = this.evaluateBoard(board);
      board[a.row][a.col] = null;

      board[b.row][b.col] = 'white';
      let scoreB = this.evaluateBoard(board);
      board[b.row][b.col] = null;

      return scoreB - scoreA;
    });
    return moves;
  }

  /**
   * Checks if the current player has won.
   */
  checkWin(row: number, col: number): boolean {
    const player = this.board[row][col];
    return (
      player !== null &&
      (this.checkDirection(row, col, player, 1, 0) ||
        this.checkDirection(row, col, player, 0, 1) ||
        this.checkDirection(row, col, player, 1, 1) ||
        this.checkDirection(row, col, player, 1, -1))
    );
  }

  /**
   * Checks a specific direction for a win.
   */
  checkDirection(
    row: number,
    col: number,
    player: string,
    deltaX: number,
    deltaY: number
  ): boolean {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      const newRow = row + deltaX * i;
      const newCol = col + deltaY * i;
      if (
        this.isValidPosition(newRow, newCol) &&
        this.board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 5; i++) {
      const newRow = row - deltaX * i;
      const newCol = col - deltaY * i;
      if (
        this.isValidPosition(newRow, newCol) &&
        this.board[newRow][newCol] === player
      ) {
        count++;
      } else {
        break;
      }
    }
    return count >= 5;
  }

  /**
   * Checks if the position is valid on the board.
   */
  isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 15 && col >= 0 && col < 15;
  }

  /**
   * Checks if a specific player has won.
   */
  checkWinCondition(board: (string | null)[][], player: string): boolean {
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (board[i][j] === player) {
          if (
            this.checkDirection(i, j, player, 1, 0) ||
            this.checkDirection(i, j, player, 0, 1) ||
            this.checkDirection(i, j, player, 1, 1) ||
            this.checkDirection(i, j, player, 1, -1)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Checks if the board is full.
   */
  isBoardFull(board: (string | null)[][]): boolean {
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (board[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Highlights a cell at the given position.
   */
  highlightCell(row: number, col: number): void {
    const cell = document.querySelector(
      `.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`
    );
    if (cell) {
      cell.classList.add('highlight');
    }
  }

  /**
   * Clears all highlights from the board.
   */
  clearHighlights(): void {
    const cells = document.querySelectorAll('.cell.highlight');
    cells.forEach((cell) => cell.classList.remove('highlight'));
  }
}
