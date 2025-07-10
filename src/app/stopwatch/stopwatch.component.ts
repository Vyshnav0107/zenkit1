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

  startPause() {
    if (this.running) {
      clearInterval(this.interval);
    } else {
      this.interval = setInterval(() => this.time += 1000, 1000);
    }
    this.running = !this.running;
  }

  reset() {
    clearInterval(this.interval);
    this.running = false;
    this.time = 0;
    this.laps = [];
  }

  lap() {
    const mins = Math.floor(this.time / 60000).toString().padStart(2, '0');
    const secs = Math.floor((this.time % 60000) / 1000).toString().padStart(2, '0');
    const lapTime = `${mins}:${secs}`;
    this.laps.push(lapTime);
  }

  formatTime(): string {
    const mins = Math.floor(this.time / 60000).toString().padStart(2, '0');
    const secs = Math.floor((this.time % 60000) / 1000).toString().padStart(2, '0');
    return `00:${mins}:${secs}`;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}