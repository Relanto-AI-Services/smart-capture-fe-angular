import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpendRequestComponent } from './create-spend-request.component';

describe('CreateSpendRequestComponent', () => {
  let component: CreateSpendRequestComponent;
  let fixture: ComponentFixture<CreateSpendRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpendRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSpendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
