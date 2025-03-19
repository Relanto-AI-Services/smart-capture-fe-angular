import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSpendRequestComponent } from './submit-spend-request.component';

describe('SubmitSpendRequestComponent', () => {
  let component: SubmitSpendRequestComponent;
  let fixture: ComponentFixture<SubmitSpendRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitSpendRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitSpendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
