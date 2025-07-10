import { Component, OnInit } from '@angular/core';
import { PomodoroService } from '../pomodoro-service.service';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html'
})
export class PomodoroTimerComponent implements OnInit {
  focusTime = 25;
  shortBreakTime = 5;
  longBreakTime = 15;
  totalSessions = 4;

  minutes: number = 25;
  seconds: number = 0;
  session: number = 1;
  phase: string = 'Focus Time';
  timer: any;
  isRunning = false;
  showSettingsModal = false;

  constructor(private pomodoroService: PomodoroService) {}

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    const config = this.pomodoroService.getSettings();
    this.focusTime = config.focusTime;
    this.shortBreakTime = config.shortBreakTime;
    this.longBreakTime = config.longBreakTime;
    this.totalSessions = config.sessions;
    this.resetTimer();
  }

  startTimer() {
    this.isRunning = true;
    this.timer = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.timer);
          this.isRunning = false;
          this.handleSessionEnd();
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  resetTimer() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.session = 1;
    this.phase = 'Focus Time';
    this.minutes = this.focusTime;
    this.seconds = 0;
  }

  handleSessionEnd() {
    if (this.phase === 'Focus Time') {
      if (this.session < this.totalSessions) {
        this.phase = 'Short Break';
        this.minutes = this.shortBreakTime;
      } else {
        this.phase = 'Long Break';
        this.minutes = this.longBreakTime;
      }
      this.session++;
    } else {
      this.phase = 'Focus Time';
      this.minutes = this.focusTime;
    }

    this.seconds = 0;
    this.startTimer();
  }

  openSettings() {
    this.showSettingsModal = true;
  }

  saveSettings() {
    this.showSettingsModal = false;
    this.resetTimer();
    this.pomodoroService.updateSettings({
      focusTime: this.focusTime,
      shortBreakTime: this.shortBreakTime,
      longBreakTime: this.longBreakTime,
      sessions: this.totalSessions
    });
  }
}
