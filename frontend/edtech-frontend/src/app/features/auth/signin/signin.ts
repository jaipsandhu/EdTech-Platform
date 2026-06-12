import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin implements OnInit {

  signinForm: FormGroup;

  isLoading = false;

  showPassword = false;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {

    this.signinForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  ngOnInit(): void {}

  togglePassword(): void {

    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(field: string): boolean {

    const control =
      this.signinForm.get(field);

    return !!(

      control &&

      control.invalid &&

      (
        control.dirty ||
        control.touched
      )
    );
  }

  isFieldValid(field: string): boolean {

    const control =
      this.signinForm.get(field);

    return !!(

      control &&

      control.valid &&

      (
        control.dirty ||
        control.touched
      )
    );
  }

  getFieldError(field: string): string {

    const control =
      this.signinForm.get(field);

    if (!control || !control.errors)
      return '';

    if (control.errors['required'])
      return 'This field is required.';

    if (control.errors['email'])
      return 'Please enter a valid email address.';

    if (control.errors['minlength']) {

      const min =
        control.errors['minlength']
          .requiredLength;

      return `Must be at least ${min} characters.`;
    }

    return 'Invalid value.';
  }

  onSubmit(): void {

    this.signinForm.markAllAsTouched();

    if (this.signinForm.invalid)
      return;

    this.isLoading = true;

    this.errorMessage = '';

    this.auth.signin(
      this.signinForm.value
    ).subscribe({

      next: (response: any) => {

        this.isLoading = false;

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'role',
          response.role
        );

        if(response.role === 'ADMIN') {

          this.router.navigate(
            ['/admin']
          );

        }

        else if(response.role === 'STUDENT') {

          this.router.navigate(
            ['/student']
          );

        }

        else if(response.role === 'TEACHER') {

          this.router.navigate(
            ['/teacher']
          );

        }

      },

      error: (err) => {

        this.isLoading = false;

        this.errorMessage =

          err?.error?.message ||

          'Incorrect email or password. Please try again.';
      }
    });
  }
}
