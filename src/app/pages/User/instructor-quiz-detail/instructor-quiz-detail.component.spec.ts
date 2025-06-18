import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorQuizDetailComponent } from './instructor-quiz-detail.component';

describe('InstructorQuizDetailComponent', () => {
  let component: InstructorQuizDetailComponent;
  let fixture: ComponentFixture<InstructorQuizDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorQuizDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorQuizDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
