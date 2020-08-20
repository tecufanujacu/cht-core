import { TestBed } from '@angular/core/testing';

import { ResourceIcons } from './resource-icons.service';

describe('ResourceIcons', () => {
  let service: ResourceIcons;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceIcons);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
