import { TestBed } from '@angular/core/testing';

import { APICallService } from './apicall.service';

describe('APICallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: APICallService = TestBed.get(APICallService);
    expect(service).toBeTruthy();
  });
});
