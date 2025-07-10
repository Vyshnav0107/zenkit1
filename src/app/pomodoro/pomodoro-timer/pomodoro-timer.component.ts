import { Component, OnInit, OnDestroy } from '@angular/core';
import { PomodoroService } from '../pomodoro-service.service';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html'
})
export class PomodoroTimerComponent implements OnInit, OnDestroy {
  focusTime = 25;
  shortBreakTime = 5;
  longBreakTime = 15;
  totalSessions = 4;

  minutes = 25;
  seconds = 0;
  session = 1;
  phase = 'Focus Time';
  isRunning = false;
  timer: any = null;
  showSettingsModal = false;

  // Click sound (used only for timer buttons)
  clickSound = new Audio('assets/click.wav');

  constructor(private pomodoroService: PomodoroService) {}

  ngOnInit() {
    this.loadSettings();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private playClickSound() {
    this.clickSound.currentTime = 0;
    this.clickSound.play();
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
    if (this.isRunning || this.timer) return;
    this.playClickSound(); // ✅ Sound only here

    this.isRunning = true;
    this.timer = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          this.clearTimer();
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

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  resetTimer() {
    this.playClickSound(); // ✅ Sound here
    this.clearTimer();
    this.session = 1;
    this.phase = 'Focus Time';
    this.setTimerMinutes(this.focusTime);
  }

  setTimerMinutes(mins: number) {
    this.minutes = mins;
    this.seconds = 0;
  }

  handleSessionEnd() {
    if (this.phase === 'Focus Time') {
      if (this.session < this.totalSessions) {
        this.phase = 'Short Break';
        this.setTimerMinutes(this.shortBreakTime);
      } else {
        this.phase = 'Long Break';
        this.setTimerMinutes(this.longBreakTime);
      }
      this.session++;
    } else {
      this.phase = 'Focus Time';
      this.setTimerMinutes(this.focusTime);
    }

    this.startTimer();
  }

  openSettings() {
    this.showSettingsModal = true; // ❌ No sound here
  }

  saveSettings() {
    this.playClickSound(); // ✅ Sound here
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
