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

  onLogin() {
    this.errorMessage = '';
    this.isSuccess = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please enter your email/username and password.';
      return;
    }

    const credentials = {
      identifier: this.loginForm.value.identifier?.trim().toLowerCase(),
      password: this.loginForm.value.password
    };

    // The .subscribe() starts here
    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        console.log('Login Success:', response);
        this.isSuccess = true;

        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('role', response.user.role);
        }

        // Logic to redirect based on username
        setTimeout(() => {
          if (response.user?.username === 'Zeel') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/homepage-tv']);
          }
        }, 1500);
      },
      error: (err: any) => {
        console.error('Login Error:', err);
        this.isSuccess = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    }); // This closes the .subscribe() block correctly
  }
