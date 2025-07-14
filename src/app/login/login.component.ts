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
    showForm = false;
    isLoginMode = false;
    showVerification = false;
    showUpdatePassword = false;

    enteredCode: string = '';
    resetEmail: string = '';      // 🆕 to store email for reset
    resetToken: string = '';      // 🆕 to store verification code

    signupForm: FormGroup;
    loginForm: FormGroup;
    updatePasswordForm: FormGroup;

    // Password visibility toggles
    showPassword = false;
    showConfirmPassword = false;
    showLoginPassword = false;
    showNewPassword = false;
    showConfirmNewPassword = false;

    toastMessage = '';
    toastColor = 'bg-green-600';
    showToast = false;
    loginError: string = '';

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

    onGetStarted() {
      this.showForm = true;
    }

    toggleFormMode(mode: 'signup' | 'login') {
      this.isLoginMode = mode === 'login';
      this.showVerification = false;
      this.showUpdatePassword = false;
    }

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
          },
        });
      }
    }

    onForgotPassword(): void {
      const email = this.loginForm.get('email')?.value;
      if (!email) {
        this.showToastMessage('Please enter your email before requesting a reset.', 'error');
        return;
      }

      this.resetEmail = email; // 🆕 store email

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

    onVerifyCode(): void {
    const email = this.loginForm.get('email')?.value;

    if (!this.enteredCode || this.enteredCode.length !== 6) {
      this.showToastMessage('Please enter the 6-digit code.', 'error');
      return;
    }

    this.authService.verifyCode(email, this.enteredCode).subscribe({
      next: (res) => {
        if (res.valid) {  // ✅ Fix this line
          this.showToastMessage('Code verified successfully.', 'success');
          this.resetEmail = email;
          this.resetToken = this.enteredCode;
          this.showVerification = false;
          this.showUpdatePassword = true;
        } else {
          this.showToastMessage('Invalid code. Please try again.', 'error');
        }
      },
      error: (err) => {
        console.error('Code verification error:', err);
        this.showToastMessage('Verification failed. Try again.', 'error');
      }
    });
  }

   onUpdatePassword(): void {
  if (this.updatePasswordForm.valid) {
    const newPassword = this.updatePasswordForm.get('newPassword')?.value;

    this.authService.resetPassword(this.resetEmail, this.resetToken, newPassword).subscribe({
      next: (res) => {
        console.log('Reset password success:', res);
        this.showToastMessage('Password updated successfully. Logging you in...', 'success');

        // ✅ Immediately log in the user after password reset
        this.authService.login({ email: this.resetEmail, password: newPassword }).subscribe({
          next: (loginRes) => {
            localStorage.setItem('token', loginRes.token); // ✅ Save the token
            setTimeout(() => {
              this.router.navigate(['/homepage']);
            }, 1000);
          },
          error: (err) => {
            console.error('Auto-login failed after reset:', err);
            this.showToastMessage('Password reset succeeded, but auto-login failed. Please login manually.', 'error');
            this.isLoginMode = true;
            this.showUpdatePassword = false;
          }
        });
      },
      error: (err) => {
        console.error('Reset password failed:', err);
        this.showToastMessage('Failed to reset password.', 'error');
      }
    });
  }
}



    // Validators
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

    // Helpers
    blockNonNumeric(event: KeyboardEvent) {
      const pattern = /[0-9]/;
      if (!pattern.test(event.key)) {
        event.preventDefault();
      }
    }

    // Visibility toggles
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

    // Toast message
    showToastMessage(message: string, type: 'success' | 'error') {
      this.toastMessage = message;
      this.toastColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    }

    // Back button from verification
    onBackFromVerification(): void {
      this.showVerification = false;
      this.isLoginMode = true;
      this.showUpdatePassword = false;
    }
  }