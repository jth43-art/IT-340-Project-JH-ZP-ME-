import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  errorMessage: string = '';
  isSuccess: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),

    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]),

    termsAccepted: new FormControl(false, [
      Validators.requiredTrue
    ])
  });

  onRegister() {
    this.errorMessage = '';
    this.isSuccess = false;

    console.log('Register button clicked');
    console.log('Form value:', this.registerForm.value);
    console.log('Form valid:', this.registerForm.valid);

    // Stop if form invalid
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage =
        'Please complete all fields correctly before registering.';
      return;
    }

    const userData = {
      fullName: this.registerForm.value.fullName?.trim(),
      username: this.registerForm.value.username?.trim(),
      email: this.registerForm.value.email?.trim().toLowerCase(),
      password: this.registerForm.value.password,
      termsAccepted: this.registerForm.value.termsAccepted
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration Success:', response);

        this.isSuccess = true;
        this.errorMessage =
          'Registration successful! Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },

      error: (err) => {
        console.error('Registration Error:', err);

        this.isSuccess = false;

        this.errorMessage =
          err.error?.message ||
          'Registration failed. Try a different email or username.';
      }
    });
  }
}
