import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorReportsComponent } from './instructor-reports.component';

describe('InstructorReportsComponent', () => {
  let component: InstructorReportsComponent;
  let fixture: ComponentFixture<InstructorReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
