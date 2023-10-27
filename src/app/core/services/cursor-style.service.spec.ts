import { TestBed } from '@angular/core/testing';

import { CursorStyleService } from './cursor-style.service';

describe('CursorStyleService', () => {
  let service: CursorStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursorStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
