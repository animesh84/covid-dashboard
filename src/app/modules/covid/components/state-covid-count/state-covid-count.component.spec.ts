import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateCovidCountComponent } from './state-covid-count.component';

describe('StateCovidCountComponent', () => {
  let component: StateCovidCountComponent;
  let fixture: ComponentFixture<StateCovidCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateCovidCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateCovidCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
