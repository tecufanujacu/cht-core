import { TestBed } from '@angular/core/testing';

import { DBSync } from './db-sync.service';

describe('DBSync', () => {
  let service: DBSync;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBSync);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
