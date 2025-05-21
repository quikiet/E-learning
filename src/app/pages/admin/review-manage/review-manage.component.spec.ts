import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewManageComponent } from './review-manage.component';

describe('ReviewManageComponent', () => {
  let component: ReviewManageComponent;
  let fixture: ComponentFixture<ReviewManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
