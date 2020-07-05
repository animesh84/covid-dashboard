import { TestBed } from '@angular/core/testing';

import { NumberApiService } from './number-api.service';

describe('NumberApiService', () => {
  let service: NumberApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
