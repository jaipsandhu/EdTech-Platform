import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Auth } from '../../../core/services/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {

  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;

  currentStep = 1;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private cdr: ChangeDetectorRef   // ← Added for reliable UI updates
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ── Form Helpers ──
  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isValid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  getError(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'This field is required.';
    if (control.errors['email']) return 'Please enter a valid email address.';
    if (control.errors['minlength']) {
      return `Must be at least ${control.errors['minlength'].requiredLength} characters.`;
    }
    if (control.errors['pattern']) return 'Code must be exactly 6 digits.';
    return 'Invalid value.';
  }

  // ── Step 1: Send Recovery Code ──
  continueToOtp(): void {
    this.emailForm.markAllAsTouched();
    if (this.emailForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    console.log('📤 Sending recovery code...');

    this.auth.recovery(this.emailForm.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('✅ Recovery code sent:', response);
          this.currentStep = 2;
          this.errorMessage = '';
          this.cdr.detectChanges();   // Force UI update
        },
        error: (err) => {
          console.error('❌ Recovery failed:', err);
          this.errorMessage = err?.error?.message || 'Could not send recovery code.';
        }
      });
  }

  // ── Step 2: Verify OTP ──
  verifyOtp(): void {
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.emailForm.get('email')?.value,
      otp: this.otpForm.get('otp')?.value
    };

    console.log('📤 Verifying OTP:', payload);

    this.auth.recoveryVerify(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('✅ OTP Verified Successfully:', response);
          this.currentStep = 3;
          this.errorMessage = '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ OTP Verification Failed:', err);
          this.errorMessage = err?.error?.message || err?.message || 'Invalid or expired code.';
        }
      });
  }

  // ── Step 3: Update Password ──
  updatePassword(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.emailForm.get('email')?.value,
      password: this.passwordForm.get('password')?.value
    };

    console.log('📤 Updating password...');

    this.auth.newPassword(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('✅ Password updated successfully:', response);
          this.currentStep = 4;
          this.errorMessage = '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Password update failed:', err);
          this.errorMessage = err?.error?.message || 'Failed to update password.';
        }
      });
  }
}
