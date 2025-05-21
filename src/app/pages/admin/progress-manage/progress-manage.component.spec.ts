import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressManageComponent } from './progress-manage.component';

describe('ProgressManageComponent', () => {
  let component: ProgressManageComponent;
  let fixture: ComponentFixture<ProgressManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
