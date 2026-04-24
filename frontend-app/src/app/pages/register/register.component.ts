import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Ensure this path is correct

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  errorMessage: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  onRegister() {
    this.errorMessage = '';

    if (this.registerForm.valid) {
      const userData = {
        username: this.registerForm.value.username?.trim(),
        email: this.registerForm.value.email?.trim().toLowerCase(),
        password: this.registerForm.value.password
      };

      // POST /register request
      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration Success:', response);
          alert('Account created successfully!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration Error:', err);
          this.errorMessage = err.error?.message || 'Registration failed. Try a different email.';
        }
      });
    }
    this.router.navigate(['/login']);
  }
}