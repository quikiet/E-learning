import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizManageComponent } from './quiz-manage.component';

describe('QuizManageComponent', () => {
  let component: QuizManageComponent;
  let fixture: ComponentFixture<QuizManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
