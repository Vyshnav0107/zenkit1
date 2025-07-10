import { TestBed } from '@angular/core/testing';

import { PomodoroServiceService } from './pomodoro-service.service';

describe('PomodoroServiceService', () => {
  let service: PomodoroServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
