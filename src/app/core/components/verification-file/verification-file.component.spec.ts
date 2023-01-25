import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationFileComponent } from './verification-file.component';

describe('VerificationFileComponent', () => {
  let component: VerificationFileComponent;
  let fixture: ComponentFixture<VerificationFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
