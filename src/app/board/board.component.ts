import { Component, OnInit } from '@angular/core';
import { BoardService } from '../service/board.service';
import { Board } from '../model/board';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  history: Board[];

  board: Board = {
    squares: null,
    xIsNext: null,
    winner: null,
    lastAction: null
  };

  serverError: string;

  constructor(private boardService: BoardService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getLatestBoard();
    this.getHistory();
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
    this.board.squares = Array(9).fill(null);
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

  private calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.board.squares[a] &&
        this.board.squares[a] === this.board.squares[b] &&
        this.board.squares[a] === this.board.squares[c]
      ) {
        return this.board.squares[a];
      }
    }
    return null;
  }

  newGame() {
    this.getEmptyBoard();
    this.saveBoard();
  }

  get player() {
    return this.board.xIsNext ? 'X' : 'O';
  }

  makeMove(index: number) {
    if (!this.board.squares[index] && this.board.winner == null) {
      this.board.squares.splice(index, 1, this.player);
      this.board.lastAction = this.player + " to position #" + (1 + index);
      this.board.xIsNext = !this.board.xIsNext;
      this.board.winner = this.calculateWinner();
      this.saveBoard();
    }
  }

}
