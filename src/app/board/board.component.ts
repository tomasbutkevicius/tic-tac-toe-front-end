import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { Board } from '../../models/board';

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

  constructor(private boardService: BoardService) { }

  ngOnInit() {
    this.getLatestBoard();
    this.getHistory();
  }

  getLatestBoard(){
    this.boardService.getLatestBoardFromApi().subscribe((response: Board) => {
      console.log(response);
      if(response.squares.length === 0){
        this.getEmptyBoard();
      } else{
        this.board = response;
      }
    },
    err => {
      console.log(err);
    });
  }

  getHistory(){
    this.boardService.getAllBoardsFromApi().subscribe((response: Board[]) => {
      this.history = response;
      console.log(history);
    },
    err => {
      console.log(err);
    });
  }

  getEmptyBoard() {
    this.board.squares = Array(9).fill(null);
    this.board.winner = null;
    this.board.xIsNext = true;
    this.board.lastAction = "Clean board"
  }

  newGame() {
    this.getEmptyBoard();
    this.saveBoard();
  }

  get player(){
    return this.board.xIsNext ? 'X' : 'O';
  }

  makeMove(index: number){
    if(!this.board.squares[index] && this.board.winner == null){
      this.board.squares.splice(index, 1, this.player);
      this.board.lastAction = this.player + " to position #" + index; 
      this.board.xIsNext = !this.board.xIsNext;    
      this.board.winner = this.calculateWinner();
      this.saveBoard();
    }
  }

  saveBoard(){
    this.boardService.saveBoardToApi(this.board).subscribe((data) => {
      console.log(data);
      this.getHistory();
    },
    err => {
      console.log(err);
    });
    
  }

  calculateWinner() {
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

}
