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
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.css'
})
export default class LoginComponent {
  errorMessage: string = '';
  isSuccess: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  loginForm = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  onLogin(): void {
    this.errorMessage = '';
    this.isSuccess = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isSuccess = false;
      this.errorMessage = 'Please enter your email/username and password.';
      return;
    }

    const credentials = {
      identifier: this.loginForm.value.identifier?.trim().toLowerCase(),
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        console.log('Login Success:', response);

        this.isSuccess = true;
        this.errorMessage = 'Login successful! Redirecting...';

        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('role', response.user.role);
        }

        setTimeout(() => {
          if (response.user?.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/homepage-tv']);
          }
        }, 1200);
      },

      error: (err: any) => {
        console.error('Login Error:', err);

        this.isSuccess = false;

        if (err.status === 401) {
          this.errorMessage = 'Incorrect password.';
        } else if (err.status === 404) {
          this.errorMessage = 'User not found.';
        } else if (err.status === 400 && err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Login failed. Please check your email/username and password.';
        }
      }
    });
  }
}
