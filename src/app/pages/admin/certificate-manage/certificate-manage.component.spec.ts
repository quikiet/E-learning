import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateManageComponent } from './certificate-manage.component';

describe('CertificateManageComponent', () => {
  let component: CertificateManageComponent;
  let fixture: ComponentFixture<CertificateManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
