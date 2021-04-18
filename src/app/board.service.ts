import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Board } from '../models/board';
import { Observable } from 'rxjs';

const httpOptions = {
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

  getLatestBoardFromApi():Observable<Board> {
    return this.http.get<Board>(this.API_URL + "/boards/latest");
  }

  getAllBoardsFromApi(){
    return this.http.get<Board[]>(this.API_URL + "/boards/");
  }

  saveBoardToApi(board: Board){
    return this.http.post(this.API_URL + "/boards", JSON.stringify(board), httpOptions);
  }

}
