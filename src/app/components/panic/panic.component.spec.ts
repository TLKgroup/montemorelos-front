import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanicComponent } from './panic.component';

describe('PanicComponent', () => {
  let component: PanicComponent;
  let fixture: ComponentFixture<PanicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
