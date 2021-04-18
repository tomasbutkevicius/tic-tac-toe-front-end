import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Board } from '../models/board';

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }

  sendNewGameToApi(){
    return this.http.get("http://127.0.0.1:3000/boards/latest");
  }

  getLatestBoardFromApi(){
    return this.http.get("http://127.0.0.1:3000/boards/latest");
  }

  getAllBoardsFromApi(){
    return this.http.get("http://127.0.0.1:3000/boards/");
  }

  saveBoardToApi(board: Board){
    return this.http.post("http://127.0.0.1:3000/boards", JSON.stringify(board), httpOptions);
  }

}
