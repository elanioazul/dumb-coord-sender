import { TestBed } from '@angular/core/testing';

import { AdmincapasService } from './admincapas.service';

describe('AdmincapasService', () => {
  let service: AdmincapasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmincapasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
