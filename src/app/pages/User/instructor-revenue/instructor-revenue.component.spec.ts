import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorRevenueComponent } from './instructor-revenue.component';

describe('InstructorRevenueComponent', () => {
  let component: InstructorRevenueComponent;
  let fixture: ComponentFixture<InstructorRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorRevenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
