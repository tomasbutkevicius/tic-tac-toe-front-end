import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Board } from '../model/board';
import { Observable } from 'rxjs';

let httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  API_URL = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) { }

  getAllBoardsFromApi(){
    return this.http.get<Board[]>(this.API_URL + "/boards");
  }

  saveBoardToApi(board: Board){
    return this.http.post(this.API_URL + "/boards", JSON.stringify(board), httpOptions);
  }

  deleteAllBoards(){
    return this.http.delete(this.API_URL + "/boards");
  }

}
