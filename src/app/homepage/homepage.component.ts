import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  dropdownOpen = false;
  activeTool: string | null = null;

  // User name from localStorage
  userFullName: string = '';

  // Change Password
  showChangePasswordForm = false;
  changePasswordForm!: FormGroup;
  passwordError = '';
  passwordSuccess = '';

  ngOnInit() {
    this.userFullName = localStorage.getItem('userFullName') || 'Guest';

    // Init change password form
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 150);
  }

  signOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userFullName');
    this.router.navigate(['/login']);
  }

  toggleTool(toolName: string) {
  if (this.activeTool !== toolName) {
    this.activeTool = toolName;
  }
  // Do nothing if the same tool is clicked again
}

  togglePomodoro() {
    this.toggleTool('pomodoro');
  }

  home() {
    this.activeTool = null;
  }

  toggleChangePasswordForm() {
    this.showChangePasswordForm = !this.showChangePasswordForm;
    this.passwordError = '';
    this.passwordSuccess = '';
    this.changePasswordForm.reset();
  }

  onChangePassword() {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.passwordSuccess = 'Password updated successfully.';
          this.passwordError = '';
          this.changePasswordForm.reset();
        },
        error: (err: any) => {
          console.error('Change password error:', err);
          this.passwordError = err.error?.message || 'Failed to update password.';
          this.passwordSuccess = '';
        }
      });
    }
  }
}
