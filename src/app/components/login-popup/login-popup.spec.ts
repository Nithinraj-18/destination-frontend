import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPopup } from './login-popup';

describe('LoginPopup', () => {
  let component: LoginPopup;
  let fixture: ComponentFixture<LoginPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
