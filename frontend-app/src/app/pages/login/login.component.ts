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

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        console.log('Login Success:', response);

        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('role', response.user.role);
          // ALSO update the service so other components know who is logged in
          this.authService.loggedInUser = response.user.username;
          this.authService.userRole = response.user.role;
        }

        setTimeout(() => {
          const role = response.user?.role || 'user';
          
          if (role === 'admin') {
            console.log('Redirecting to Admin Dashboard');
            this.router.navigate(['/admin-dashboard']);
          } else {
            console.log('Redirecting to Normal Homepage');
            this.router.navigate(['/homepage-tv']);
          }
        }, 1500); // 1.5 second delay so user sees the success message
      },

        this.router.navigate(['/homepage-tv']);
      },

      error: (err: any) => {
        console.error('Login Error:', err);
        this.isSuccess = false;
        this.errorMessage =
          err.error?.message ||
          'Login failed. Please check your credentials and try again.';
      }
    });
  }
}
