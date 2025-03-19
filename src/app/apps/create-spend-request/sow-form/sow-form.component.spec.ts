import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowFormComponent } from './sow-form.component';

describe('SowFormComponent', () => {
  let component: SowFormComponent;
  let fixture: ComponentFixture<SowFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SowFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
