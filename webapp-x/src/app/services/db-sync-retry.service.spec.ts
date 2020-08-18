import { TestBed } from '@angular/core/testing';

import { DbSyncRetry } from './db-sync-retry.service';

describe('DbSyncRetry', () => {
  let service: DbSyncRetry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbSyncRetry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
