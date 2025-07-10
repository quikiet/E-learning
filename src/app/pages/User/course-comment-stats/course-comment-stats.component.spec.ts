import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCommentStatsComponent } from './course-comment-stats.component';

describe('CourseCommentStatsComponent', () => {
  let component: CourseCommentStatsComponent;
  let fixture: ComponentFixture<CourseCommentStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCommentStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCommentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
