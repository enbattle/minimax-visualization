import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connect-five',
  templateUrl: './connect-five.component.html',
  styleUrls: ['./connect-five.component.css']
})
export class ConnectFiveComponent implements OnInit {
  rows: number = 15;
  columns: number = 15;
  winningSequence: number = 5;

  board: string[][] = [];
  isX: boolean = Math.random() < 0.5 ? true : false;

  playerMove: {y: number, x: number} = {y: -1, x: -1};
  opponentMove: {y: number, x: number} = {y: -1, x: -1};
  totalMoves: number = 0;
  hasWinner: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Create board on init
    for(let i=0; i<this.rows * this.columns; i++) {
      if(i % this.rows === 0) {
        this.board.push([]);
      }
      this.board[this.board.length - 1].push("");
    }
  }

  /**
   * When a cell is clicked on the board, determine is there is a winner
   * The other player (computer) will go after the user goes
   * 
   * @param event - click event for a cell on the board
   */
  public onCellClick(event: any) : void {
    if(!this.hasWinner) {
      const boardCoordinate = event.target.id.split("_");
      const y = parseInt(boardCoordinate[0]);
      const x = parseInt(boardCoordinate[1]);

      if(this.board[y][x] === "") {
        const label = this.board[y][x] = this.isX ? "X" : "O";
        this.playerMove.y = y;
        this.playerMove.x = x;
        this.totalMoves++;

        if(this.checkWin(label, this.playerMove)) {
          this.hasWinner = true;
          alert("Player " + label + " is the winner!");
        } 
        else if(!this.hasWinner && this.totalMoves === this.rows * this.columns) {
          alert("Tie. No player wins!");
        }
        else {
          const opponentMove = this.getMinimaxMove(this.board, -1, label, this.playerMove, !this.isX);
          const opponentY = opponentMove.coordinate.y;
          const opponentX = opponentMove.coordinate.x;
          const opponentLabel = this.board[opponentY][opponentX] = this.isX ? "O" : "X";
          this.opponentMove.y = opponentY;
          this.opponentMove.x = opponentX;
          this.totalMoves++;

          if(this.checkWin(opponentLabel, this.opponentMove)) {
            this.hasWinner = true;
            alert("Player " + opponentLabel + " is the winner!");
          } 
          else if(!this.hasWinner && this.totalMoves === this.rows * this.columns) {
            alert("Tie. No player wins!");
          }
        }
      }
    }
  }

  /**
   * 
   * @param label - indicates the "X" or "O" player (or computer)
   * @param coordinate  - coordinates for the most recent move
   * @returns boolean determining whether or not the player (or computer) has won the game
   */
  public checkWin(label: string, coordinate: {y: number, x: number}): boolean {
    // Check Horizontal
    let checkHorizontal = 1;
    let horizontalX = coordinate.x-1;
    while(horizontalX >= 0 && this.board[coordinate.y][horizontalX] === label) {
      if(this.board[coordinate.y][horizontalX] === label) {
        checkHorizontal++;
      }
      horizontalX--;
    }
    horizontalX = coordinate.x+1;
    while(horizontalX <= this.columns-1 && this.board[coordinate.y][horizontalX] === label) {
      if(this.board[coordinate.y][horizontalX] === label) {
        checkHorizontal++;
      }
      horizontalX++;
    }

    // Check Vertical
    let checkVertical = 1;
    let horizontalY = coordinate.y-1;
    while(horizontalY >= 0 && this.board[horizontalY][coordinate.x] === label) {
      if(this.board[horizontalY][coordinate.x] === label) {
        checkVertical++;
      }
      horizontalY--;
    }
    horizontalY = coordinate.y+1;
    while(horizontalY <= this.rows-1 && this.board[horizontalY][coordinate.x] === label) {
      if(this.board[horizontalY][coordinate.x] === label) {
        checkVertical++;
      }
      horizontalY++;
    }

    // Check Diagonal
    let checkDiagonal = 1;
    horizontalY = coordinate.y-1;
    horizontalX = coordinate.x-1;
    while(horizontalY >= 0 && horizontalX >= 0 && this.board[horizontalY][horizontalX] === label) {
      if(this.board[horizontalY][horizontalX] === label) {
        checkDiagonal++;
      }
      horizontalY--;
      horizontalX--;
    }
    horizontalY = coordinate.y+1;
    horizontalX = coordinate.x+1;
    while(horizontalY <= this.rows-1 && horizontalX-1 <= this.columns && this.board[horizontalY][horizontalX] === label) {
      if(this.board[horizontalY][horizontalX] === label) {
        checkDiagonal++;
      }
      horizontalY++;
      horizontalX++;
    }

    // Check Anti-Diagonal
    let checkAntiDiagonal = 1;
    horizontalY = coordinate.y+1;
    horizontalX = coordinate.x-1;
    while(horizontalY <= this.rows-1 && horizontalX >= 0 && this.board[horizontalY][horizontalX] === label) {
      if(this.board[horizontalY][horizontalX] === label) {
        checkAntiDiagonal++;
      }
      horizontalY++;
      horizontalX--;
    }
    horizontalY = coordinate.y-1;
    horizontalX = coordinate.x+1;
    while(horizontalY >= 0 && horizontalX <= this.columns-1 && this.board[horizontalY][horizontalX] === label) {
      if(this.board[horizontalY][horizontalX] === label) {
        checkAntiDiagonal++;
      }
      horizontalY--;
      horizontalX++;
    }

    if(checkVertical === this.winningSequence
      || checkHorizontal === this.winningSequence
      || checkDiagonal === this.winningSequence
      || checkAntiDiagonal === this.winningSequence
    ) {
      return true;
    }
    return false;
  }

  /**
   * 
   * @param board - board containing the current moves as strings
   * @returns all available moves for the board
   */
  private getAvailableMoves(board: string[][]): string[] {
    const moves = [];

    for(let i=0; i<board.length; i++) {
      for(let j=0; j<board[i].length; j++) {
        if(board[i][j] !== "O" && board[i][j] !== "X") {
          moves.push(i.toString() + "_" + j.toString());
        }
      }
    }

    return moves;
  }

  /**
   * 
   * @param board - board containing current moves as strings
   * @param moveIndex - index of the move in the list of available moves
   * @param moveLabel - label of the move (either "X" or "O")
   * @param moveCoordinate - x and y coordinates for move
   * @param isXPlayer - determines player to check for min move or max move
   * @returns best minimax move
   */
  private getMinimaxMove(board: string[][], moveIndex: number, moveLabel: string, moveCoordinate: {y: number, x: number}, isXPlayer: boolean): 
  { index: number, score: number, coordinate: {y: number, x: number} } {
    if(this.checkWin(moveLabel, moveCoordinate)) {
      return isXPlayer ? { index: moveIndex, score: 10, coordinate: moveCoordinate }
      : { index: moveIndex, score: -10, coordinate: moveCoordinate };
    }

    const availMoves = this.getAvailableMoves(board);
    if(availMoves.length === 0) {
      return { index: moveIndex, score: 0, coordinate: moveCoordinate};
    }

    const newBoard = board;
    const moves = [];
    for(let i=0; i<availMoves.length; i++) {
      let move = {
        index: -1,
        score: 0,
        coordinate: {y: -1, x: -1}
      };
      move.index = i;

      const currentMove = availMoves[i].split("_");
      const y = parseInt(currentMove[0]);
      const x = parseInt(currentMove[1]);
      move.coordinate.y = y;
      move.coordinate.x = x;
      newBoard[y][x] = isXPlayer ? "X" : "O";

      const minimaxVal = this.getMinimaxMove(newBoard, move.index, isXPlayer ? "X" : "O", {y: y, x: x}, !isXPlayer);
      move.score = minimaxVal.score;
      
      newBoard[y][x] = "";
      moves.push(move);
    }

    let bestMove = 0;
    if(isXPlayer) {
      let bestScore = Number.POSITIVE_INFINITY;
      for(let i=0; i<moves.length; i++) {
        if(moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    else {
      let bestScore = Number.NEGATIVE_INFINITY;
      for(let i=0; i<moves.length; i++) {
        if(moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }
}
