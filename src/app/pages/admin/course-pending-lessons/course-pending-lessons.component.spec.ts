import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePendingLessonsComponent } from './course-pending-lessons.component';

describe('CoursePendingLessonsComponent', () => {
  let component: CoursePendingLessonsComponent;
  let fixture: ComponentFixture<CoursePendingLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePendingLessonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePendingLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
