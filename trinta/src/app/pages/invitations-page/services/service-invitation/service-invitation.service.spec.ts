import { TestBed } from '@angular/core/testing';

import { ServiceInvitationService } from './service-invitation.service';

describe('ServiceInvitationService', () => {
  let service: ServiceInvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceInvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
