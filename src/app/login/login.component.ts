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
         

          // ✅ Show login form
          this.isLoginMode = true;
          this.showVerification = false;
          this.showUpdatePassword = false;

          // Optionally reset signup form
          this.signupForm.reset();
        },
       error: (err) => {
  console.error('Signup error:', err);
  alert(`Signup failed: ${err.status} - ${err.message}`);
}
      });
    }
  }

  // 🔐 LOGIN
  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login form submitted with:', this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login success:', res);
           this.showToastMessage('Login successful!');
        setTimeout(() => {
          this.router.navigate(['/homepage']);
        }, 1000); // Delay redirect to let toast show
      },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials. Please try again.');
        },
      });
    }
    
  }

  // 🔁 FORGOT PASSWORD
  onForgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      alert('Please enter your email before requesting a reset.');
      return;
    }

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        alert('Reset code sent to your email.');
        this.showVerification = true;
        this.isLoginMode = false;
        this.showUpdatePassword = false;
      },
      error: (err) => {
        console.error('Forgot password error:', err);
        alert('Email not found.');
      },
    });
  }

  // ✅ VERIFY CODE
  onVerifyCode(): void {
    // Simulate code verification success
    this.showVerification = false;
    this.showUpdatePassword = true;
  }

  // 🔁 RESET PASSWORD
  onUpdatePassword(): void {
    if (this.updatePasswordForm.valid) {
      const token = 'dummyToken'; // Replace with actual token logic
      const newPassword = this.updatePasswordForm.get('newPassword')?.value;

      this.authService.resetPassword(token, newPassword).subscribe({
        next: () => {
          alert('Password updated successfully.');
          this.router.navigate(['/homepage']);
        },
        error: (err) => {
          console.error('Reset password failed:', err);
          alert('Failed to reset password.');
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
showToast = false;

showToastMessage(message: string) {
  this.toastMessage = message;
  this.showToast = true;
  setTimeout(() => {
    this.showToast = false;
  }, 2000); // Toast visible for 2 seconds
}
}
