import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showForm = false;
  isLoginMode = false;
  showVerification = false;
  showUpdatePassword = false;

  signupForm: FormGroup;
  loginForm: FormGroup;
  updatePasswordForm: FormGroup;

  // Password visibility toggles
  showPassword = false;
  showConfirmPassword = false;
  showLoginPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.updatePasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: this.updatePasswordMatchValidator }
    );
  }

  onGetStarted() {
    this.showForm = true;
  }

  toggleFormMode(mode: 'signup' | 'login') {
    this.isLoginMode = mode === 'login';
    this.showVerification = false;
    this.showUpdatePassword = false;
  }

  // 🔐 SIGNUP
  onSubmit(): void {
    if (this.signupForm.valid) {
      const data = {
        fullName: this.signupForm.value.fullName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };

      this.authService.signup(data).subscribe({
        next: () => {
          alert('Signup successful! Please login.');
          this.toggleFormMode('login');
        },
        error: () => {
          alert('Signup failed. Email may already be registered.');
        },
      });
    }
  }

  // 🔐 LOGIN
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login success:', res);
          this.router.navigate(['/homepage']);
        },
        error: () => {
          alert('Invalid credentials. Please try again.');
        },
      });
    }
  }

  // 🤔 FORGOT PASSWORD
  onForgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      alert('Please enter your email before requesting reset.');
      return;
    }

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        alert('Reset code sent to your email.');
        this.showVerification = true;
        this.isLoginMode = false;
        this.showUpdatePassword = false;
      },
      error: () => {
        alert('Email not found.');
      },
    });
  }

  // ✅ VERIFY CODE
  onVerifyCode(): void {
    this.showVerification = false;
    this.showUpdatePassword = true;
  }

  // 🔁 UPDATE PASSWORD
  onUpdatePassword(): void {
    if (this.updatePasswordForm.valid) {
      const token = 'dummyToken'; // Replace with real token from email
      const newPassword = this.updatePasswordForm.get('newPassword')?.value;

      this.authService.resetPassword(token, newPassword).subscribe({
        next: () => {
          alert('Password updated successfully.');
          this.router.navigate(['/homepage']);
        },
        error: () => {
          alert('Failed to reset password.');
        },
      });
    }
  }

  // 🛡️ Match Validators
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  updatePasswordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  blockNonNumeric(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  // 👁️ TOGGLE PASSWORD VISIBILITY
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleShowLoginPassword() {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowConfirmNewPassword() {
    this.showConfirmNewPassword = !this.showConfirmNewPassword;
  }
}
