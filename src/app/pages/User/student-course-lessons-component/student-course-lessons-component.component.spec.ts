import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseLessonsComponentComponent } from './student-course-lessons-component.component';

describe('StudentCourseLessonsComponentComponent', () => {
  let component: StudentCourseLessonsComponentComponent;
  let fixture: ComponentFixture<StudentCourseLessonsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCourseLessonsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCourseLessonsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
