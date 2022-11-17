import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectFiveComponent } from './connect-five.component';

describe('ConnectFiveComponent', () => {
  let component: ConnectFiveComponent;
  let fixture: ComponentFixture<ConnectFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectFiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
