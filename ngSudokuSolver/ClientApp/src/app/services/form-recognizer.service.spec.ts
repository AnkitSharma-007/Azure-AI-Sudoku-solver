import { TestBed } from '@angular/core/testing';

import { FormRecognizerService } from './form-recognizer.service';

describe('FormRecognizerService', () => {
  let service: FormRecognizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormRecognizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
