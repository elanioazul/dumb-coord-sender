import { TestBed } from '@angular/core/testing';

import { AbsService } from './abs.service';

describe('AbsService', () => {
  let service: AbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
