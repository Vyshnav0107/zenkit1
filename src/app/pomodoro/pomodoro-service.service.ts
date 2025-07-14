// pomodoro.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private settings = {
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    sessions: 4
  };

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings: any) {
    this.settings = { ...this.settings, ...newSettings };
  }
}
