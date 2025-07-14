import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnDestroy {
  time = 0; // time in milliseconds
  interval: any;
  running = false;
  laps: string[] = [];

  // Sound effect
  clickSound = new Audio('assets/click.wav');

  /**
   * Play the click sound
   */
  playClickSound(): void {
    this.clickSound.currentTime = 0;
    this.clickSound.play();
  }

  /**
   * Start or pause the stopwatch
   */
  startPause(): void {
    this.playClickSound();
    if (this.running) {
      clearInterval(this.interval);
    } else {
      this.interval = setInterval(() => this.time += 1000, 1000);
    }
    this.running = !this.running;
  }

  /**
   * Reset the stopwatch and lap list
   */
  reset(): void {
    this.playClickSound();
    clearInterval(this.interval);
    this.running = false;
    this.time = 0;
    this.laps = [];
  }

  /**
   * Record current lap time
   */
  lap(): void {
    this.playClickSound();
    this.laps.push(this.getFormattedTime());
  }

  /**
   * Get formatted time as hh:mm:ss
   */
  formatTime(): string {
    return this.getFormattedTime(true);
  }

  /**
   * Shared time formatting logic
   * @param includeHours whether to include `00:` prefix
   */
  private getFormattedTime(includeHours: boolean = false): string {
    const mins = Math.floor(this.time / 60000);
    const secs = Math.floor((this.time % 60000) / 1000);
    const hours = Math.floor(mins / 60);

    const formattedMins = (mins % 60).toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');

    return includeHours
      ? `${formattedHours}:${formattedMins}:${formattedSecs}`
      : `${formattedMins}:${formattedSecs}`;
  }

  /**
   * Cleanup interval on destroy
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
