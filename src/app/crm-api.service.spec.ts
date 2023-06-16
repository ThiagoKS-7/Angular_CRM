import { TestBed } from '@angular/core/testing';
import { CrmApiService } from './crm-api.service';

describe('CrmApiService', () => {
  let service: CrmApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrmApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
