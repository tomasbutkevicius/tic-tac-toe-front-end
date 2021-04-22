import { Component, OnInit } from '@angular/core';
import { BoardService } from '../service/board.service';
import { Board } from '../model/board';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

//TODO: After refresh the winner is not calculated correctly. Containers also need to be stored in storage. 

export class BoardComponent implements OnInit {

  history: Board[];

  board: Board = {
    squares: null,
    xIsNext: null,
    winner: null,
    lastAction: null
  };

  rowsContainer: number[];
  columnsContainer: number[];
  diagonalContainer: number[];
  oppositeDiagonalContainer: number[];

  xrowsContainer: number[];
  xcolumnsContainer: number[];
  xdiagonalContainer: number[];
  xoppositeDiagonalContainer: number[];

  serverError: string;

  constructor(private boardService: BoardService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getLatestBoard();
    this.getHistory();
    this.fillContainers();
  }

  fillContainers() {
    this.rowsContainer = Array(3).fill(0);
    this.columnsContainer = Array(3).fill(0);
    this.diagonalContainer = Array(3).fill(0);
    this.oppositeDiagonalContainer = Array(3).fill(0);
    this.xrowsContainer = Array(3).fill(0);
    this.xcolumnsContainer = Array(3).fill(0);
    this.xdiagonalContainer = Array(3).fill(0);
    this.xoppositeDiagonalContainer = Array(3).fill(0);
  }

  private getLatestBoard() {
    let sessionLatestBoard = sessionStorage.getItem('latestBoard');
    if (sessionLatestBoard) {
      this.board = JSON.parse(sessionLatestBoard);
    }
  }

  private getHistory() {
    this.boardService.getAllBoardsFromApi().subscribe((response: Board[]) => {
      this.history = response;
      this.serverError = null;
      this.changeDetectorRef.detectChanges();
    },
      err => {
        this.serverError = "Could not retrieve game history from server";
        this.changeDetectorRef.detectChanges();
        console.log(err);
      });
  }

  private getEmptyBoard() {
    let squareCount = 9;
    this.board.squares = Array(squareCount).fill(null);
    this.board.winner = null;
    this.board.xIsNext = true;
    this.board.lastAction = "Clean board";
  }

  private saveBoard() {
    this.boardService.saveBoardToApi(this.board).subscribe((data) => {
      this.getHistory();
    },
      err => {
        console.log(err);
        this.serverError = "Could not save game history to server";
        this.changeDetectorRef.detectChanges();
        console.log(err);
      });
    sessionStorage.setItem('latestBoard', JSON.stringify(this.board));
  }

  private calculateWinner(row: number, column: number, index: number, rowsContainer: number[], columnsContainer: number[], diagonalContainer: number[], oppositeDiagonalContainer: number[]) {
    rowsContainer[row] = rowsContainer[row] + 1;
    columnsContainer[column] = columnsContainer[column] + 1;

    if (row === column) {
      diagonalContainer[row] = diagonalContainer[row] + 1;
    }

    if ((row + column + 1) === 3) {
      oppositeDiagonalContainer[row] = oppositeDiagonalContainer[row] + 1;
    }

    if (rowsContainer[row] === 3) {
      this.board.winner = this.board.squares[index];
      this.fillContainers();
      return;
    }

    if (columnsContainer[column] === 3) {
      this.board.winner = this.board.squares[index];
      this.fillContainers();
      return;
    }

    let diagnoalContainerSum = diagonalContainer.reduce((a, b) => a + b, 0);
    let oppositeDiagonalContainerSum = oppositeDiagonalContainer.reduce((a, b) => a + b, 0);

    if (diagnoalContainerSum === 3) {
      this.board.winner = this.board.squares[index];
      this.fillContainers();
      return;
    }

    if (oppositeDiagonalContainerSum === 3) {
      this.board.winner = this.board.squares[index];
      this.fillContainers();
      return;
    }

    return null;
  }

  newGame() {
    this.getEmptyBoard();
    this.saveBoard();
    this.fillContainers();
  }

  get player() {
    return this.board.xIsNext ? 'X' : 'O';
  }

  makeMove(index: number) {
    if (!this.board.squares[index] && this.board.winner == null) {
      this.board.squares.splice(index, 1, this.player);
      this.board.lastAction = this.player + " to position #" + (1 + index);
      this.board.xIsNext = !this.board.xIsNext;

      let row = Math.floor(index / 3);
      let column = index % 3;

      if (this.board.squares[index] === 'O')
        this.calculateWinner(row, column, index, this.rowsContainer, this.columnsContainer, this.diagonalContainer, this.oppositeDiagonalContainer);
      else
        this.calculateWinner(row, column, index, this.xrowsContainer, this.xcolumnsContainer, this.xdiagonalContainer, this.xoppositeDiagonalContainer);
      this.saveBoard();
    }
  }

}
