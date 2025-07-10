import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
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
  password: ['', Validators.required]
});

    this.updatePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    }, { validators: this.updatePasswordMatchValidator });
  }

  onGetStarted() {
    this.showForm = true;
  }

  toggleFormMode(mode: 'signup' | 'login') {
    this.isLoginMode = mode === 'login';
    this.showVerification = false;
    this.showUpdatePassword = false;
  }

  // 🔐 SIGNUP SUBMIT
  onSubmit(): void {
    if (this.signupForm.valid) {
      // simulate account creation and switch to login form
      this.toggleFormMode('login');
    }
  }

  // 🔐 LOGIN SUBMIT
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.router.navigate(['/homepage']);
    }
  }

  // 🤔 FORGOT PASSWORD
  onForgotPassword(): void {
    this.showVerification = true;
    this.isLoginMode = false;
    this.showUpdatePassword = false;
  }

  // ✅ VERIFY CODE
  onVerifyCode(): void {
    this.showVerification = false;
    this.showUpdatePassword = true;
  }

  // 🔁 UPDATE PASSWORD
  onUpdatePassword(): void {
    if (this.updatePasswordForm.valid) {
      this.router.navigate(['/homepage']);
    }
  }

  // 🛡️ Password match check
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
