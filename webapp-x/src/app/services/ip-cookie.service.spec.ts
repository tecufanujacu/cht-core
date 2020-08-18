import { TestBed } from '@angular/core/testing';

import { IpCookie } from './ip-cookie.service';

describe('IpCookie', () => {
  let service: IpCookie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpCookie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
