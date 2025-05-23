import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeletedComponent } from './user-deleted.component';

describe('UserDeletedComponent', () => {
  let component: UserDeletedComponent;
  let fixture: ComponentFixture<UserDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeletedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
