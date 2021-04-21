import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardService } from '../service/board.service';
import { HttpClientModule } from '@angular/common/http';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [BoardService],
      declarations: [ BoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(BoardService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should render button', () => {
    const fixture = TestBed.createComponent(BoardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#newGameBtn').textContent).toBeTruthy();
  });
});
