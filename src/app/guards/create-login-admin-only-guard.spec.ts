import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { createLoginAdminOnlyGuard } from './create-login-admin-only-guard';

describe('createLoginAdminOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => createLoginAdminOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
