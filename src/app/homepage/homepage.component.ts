import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  dropdownOpen = false;
  activeTool: string | null = null;
  userFullName: string = '';

  showChangePasswordForm = false;
  changePasswordForm!: FormGroup;
  passwordError = '';
  passwordSuccess = '';

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  @ViewChild('modalRef') modalRef!: ElementRef;

  ngOnInit() {
    this.userFullName = localStorage.getItem('userFullName') || 'Guest';

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  toggleDropdown() {
    if (!this.showChangePasswordForm) {
      this.dropdownOpen = !this.dropdownOpen;
    }
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  toggleTool(toolName: string) {
    if (this.activeTool !== toolName) {
      this.activeTool = toolName;
    }
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

    // Lock or unlock scroll
    document.body.style.overflow = this.showChangePasswordForm ? 'hidden' : 'auto';

    // Always close dropdown if modal opens
    if (this.showChangePasswordForm) {
      this.closeDropdown();
    }
  }

  signOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userFullName');
    this.router.navigate(['/login']);
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

  // ✅ Protect dropdown from closing when modal is open
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInsideDropdown = this.dropdownRef?.nativeElement.contains(event.target);
    const clickedInsideModal = this.modalRef?.nativeElement?.contains(event.target);
    const modalOpen = this.showChangePasswordForm;

    if (!clickedInsideDropdown && !clickedInsideModal && !modalOpen) {
      this.closeDropdown();
    }
  }
}
