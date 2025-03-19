import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacticTableComponent } from './tactic-table.component';

describe('TacticTableComponent', () => {
  let component: TacticTableComponent;
  let fixture: ComponentFixture<TacticTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacticTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
