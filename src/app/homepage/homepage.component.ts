import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  constructor(private router: Router) {}

  dropdownOpen = false;
  activeTool: string | null = null;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 150);
  }

  signOut() {
    this.router.navigate(['/login']);
  }

  toggleTool(toolName: string) {
    if (this.activeTool === toolName) {
      // Tool already active — do nothing
      return;
    }
    this.activeTool = toolName;
  }
  togglePomodoro() {
  this.activeTool = this.activeTool === 'pomodoro' ? null : 'pomodoro';
}


  home() {
    this.activeTool = null;
  }
}
