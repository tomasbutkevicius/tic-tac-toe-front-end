import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BoardService } from './board.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Board } from '../models/board';

describe('BoardService', () => {
  let service: BoardService,
    httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [BoardService]
    });
    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
      httpMock.verify();
    }
  );

  it('should retrieve boards from API via GET', () => {
    const dummyBoards: Board[] = [{
      squares: [null, null, 'O', 'X'],
      xIsNext: true,
      winner: "test",
      lastAction: "test"
    },
    {
      squares: [null, null, 'O', 'X'],
      xIsNext: true,
      winner: "test",
      lastAction: "test"
    }];

    service.getAllBoardsFromApi().subscribe(boards => {
      expect(boards.length).toBe(2);
      expect(boards).toEqual(dummyBoards);
    });

    const request = httpMock.expectOne(service.API_URL + "/boards");

    expect(request.request.method).toBe('GET');

    request.flush(dummyBoards);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
