import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPurchasedCoursesComponentComponent } from './student-purchased-courses-component.component';

describe('StudentPurchasedCoursesComponentComponent', () => {
  let component: StudentPurchasedCoursesComponentComponent;
  let fixture: ComponentFixture<StudentPurchasedCoursesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPurchasedCoursesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPurchasedCoursesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
