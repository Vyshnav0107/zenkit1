import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  onBackFromVerification(): void {
    this.showVerification = false;
    this.isLoginMode = true;  // or false if returning to signup
    this.showUpdatePassword = false;
  }
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
    private authService: AuthService,
    private location: Location
  ) {
    // SignUp Form
    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    // Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Update Password Form
    this.updatePasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: this.updatePasswordMatchValidator }
    );
  }

  // Show main form
  onGetStarted() {
    this.showForm = true;
  }

  // Toggle between SignUp and Login
  toggleFormMode(mode: 'signup' | 'login') {
    this.isLoginMode = mode === 'login';
    this.showVerification = false;
    this.showUpdatePassword = false;
  }

  // 🟢 SIGNUP
  onSubmit(): void {
    if (this.signupForm.valid) {
      const data = {
        fullName: this.signupForm.value.fullName,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };

      this.authService.signup(data).subscribe({
        next: (res) => {
          console.log('Signup success:', res);
         
  this.showToastMessage('Signup successful! Please login.', 'success');
        this.isLoginMode = true;
        this.showVerification = false;
        this.showUpdatePassword = false;
        this.signupForm.reset();
      },
      error: (err) => {
        console.error('Signup error:', err);
        this.showToastMessage('Signup failed: Email already exists.', 'error');
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
        this.showToastMessage('Login successful!', 'success');
        setTimeout(() => {
          this.router.navigate(['/homepage']);
        }, 2000);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.showToastMessage('Invalid credentials. Please try again.', 'error');
      }
    });
  }
 
}


  // 🔁 FORGOT PASSWORD
 onForgotPassword(): void {
  const email = this.loginForm.get('email')?.value;
  if (!email) {
    this.showToastMessage('Please enter your email before requesting a reset.', 'error');
    return;
  }

  this.authService.forgotPassword(email).subscribe({
    next: () => {
      this.showToastMessage('Reset code sent to your email.', 'success');
      this.showVerification = true;
      this.isLoginMode = false;
      this.showUpdatePassword = false;
    },
    error: (err) => {
      console.error('Forgot password error:', err);
      this.showToastMessage('Email not found.', 'error');
    },
  });
}
enteredCode: string = '';
verificationError: string = '';


  onVerifyCode() {
  if (!this.enteredCode.trim()) {
    this.verificationError = 'Please enter the verification code.';
    setTimeout(() => this.verificationError = '', 3000);
    return;
  }

  this.authService.verifyCode(this.enteredCode).subscribe({
    next: (res) => {
      if (res.success) {
        this.verificationError = '';
        this.showVerification = false;
        this.showUpdatePassword = true;
      } else {
        this.verificationError = 'Invalid code. Please try again.';
        setTimeout(() => this.verificationError = '', 3000);
      }
    },
    error: (err) => {
      this.verificationError = err.error?.message || 'Verification failed.';
      setTimeout(() => this.verificationError = '', 3000);
    }
  });
}


  // 🔁 RESET PASSWORD
  onUpdatePassword(): void {
  if (this.updatePasswordForm.valid) {
    const token = 'dummyToken'; // Replace with actual token logic
    const newPassword = this.updatePasswordForm.get('newPassword')?.value;

    this.authService.resetPassword(token, newPassword).subscribe({
      next: () => {
        this.showToastMessage('Password updated successfully.', 'success');
        setTimeout(() => {
          this.router.navigate(['/homepage']);
        }, 2000);
      },
      error: (err) => {
        console.error('Reset password failed:', err);
        this.showToastMessage('Failed to reset password.', 'error');
      },
    });
  }
}

  // ✅ Password match validators
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

  // 🧠 Input helpers
  blockNonNumeric(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  // 👁️ Password visibility toggles
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
toastMessage = '';
toastColor = 'bg-green-600'; // default to success
showToast = false;
showToastMessage(message: string, type: 'success' | 'error') {
  this.toastMessage = message;
  this.toastColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  this.showToast = true;
  setTimeout(() => {
    this.showToast = false;
  }, 2000);
}

loginError: string = '';
}

