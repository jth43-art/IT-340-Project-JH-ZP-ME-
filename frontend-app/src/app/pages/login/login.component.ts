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

  loginForm = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onLogin(): void {
    this.errorMessage = '';
    this.isSuccess = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter your email/username and password.';
      return;
    }

    const inputVal = this.loginForm.value.identifier?.trim() || '';
    const passwordVal = this.loginForm.value.password || '';

    // Send payload matching backend expectations
    const credentials = {
      email: inputVal,
      username: inputVal,
      identifier: inputVal,
      password: passwordVal
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        this.isSuccess = true;
        this.errorMessage = 'Login successful! Redirecting...';

        const user = response.user || response;
        const isAdmin = user?.role === 'admin' || user?.username === 'Zeel';

        setTimeout(() => {
          if (isAdmin) {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/homepage-tv']);
          }
        }, 1000);
      },

      error: (err: any) => {
        console.error('Login Error:', err);
        this.isSuccess = false;

        if (err.status === 401) {
          this.errorMessage = 'Invalid email/username or password.';
        } else if (err.status === 404) {
          this.errorMessage = 'User account not found.';
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unable to connect to server. Please try again.';
        }
      }
    });
  }
}
