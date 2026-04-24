import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Ensure this path is correct

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.css'
})
export default class LoginComponent {
  errorMessage: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  onLogin() {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email?.trim().toLowerCase(),
        password: this.loginForm.value.password
      };

      // POST /login request
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login Success:', response);
          // Store token if your backend returns one
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.router.navigate(['/homepage-tv']);
        },
        error: (err) => {
          console.error('Login Error:', err);
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        }
      });
    }
    this.router.navigate(['/homepage-tv']);
  }
}