import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  registerForm: FormGroup;
  otpForm: FormGroup;

  currentStep = 1;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef   // ← Force UI refresh
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Validation helpers
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isFieldValid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email address.';
    if (control.errors['minlength']) {
      return `Must be at least ${control.errors['minlength'].requiredLength} characters.`;
    }
    return 'Invalid value.';
  }

  isOtpInvalid(): boolean {
    const control = this.otpForm.get('otp');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isOtpValid(): boolean {
    const control = this.otpForm.get('otp');
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  getOtpError(): string {
    const control = this.otpForm.get('otp');
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Please enter the 6-digit code.';
    if (control.errors['pattern']) return 'Code must be exactly 6 digits.';
    return 'Invalid code.';
  }

  // Password strength
  get strengthScore(): number {
    const pw = this.registerForm.get('password')?.value || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  get strengthLabel(): string {
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return labels[this.strengthScore - 1] || 'Weak';
  }

  getStrengthClass(index: number): string {
    const score = this.strengthScore;
    if (index >= score) return '';
    const classes = ['weak', 'fair', 'good', 'strong'];
    return classes[score - 1] || '';
  }

  // ── Submit Handlers ──
  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    console.log('📤 Sending registration request...');

    this.auth.register(this.registerForm.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          this.currentStep = 2;
          this.errorMessage = '';
          this.cdr.detectChanges();   // Force UI update
        },
        error: (err) => {
          console.error('❌ Registration failed:', err);
          this.errorMessage = err?.error?.message
            || err?.message
            || 'Registration failed. Please try again.';
        }
      });
  }

  verifyOtp(): void {
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.registerForm.get('email')?.value,
      otp: this.otpForm.get('otp')?.value
    };

    console.log('📤 Verifying OTP:', payload);

    this.auth.verifyOtp(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('✅ OTP Verified Successfully:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('❌ OTP Verification Failed:', err);
          this.errorMessage = err?.error?.message || 'Invalid or expired code.';
        }
      });
  }
}
