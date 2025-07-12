import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizationComponent } from './unauthorization.component';

describe('UnauthorizationComponent', () => {
  let component: UnauthorizationComponent;
  let fixture: ComponentFixture<UnauthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
