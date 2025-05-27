import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSearchSidebarComponent } from './course-search-sidebar.component';

describe('CourseSearchSidebarComponent', () => {
  let component: CourseSearchSidebarComponent;
  let fixture: ComponentFixture<CourseSearchSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSearchSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSearchSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
