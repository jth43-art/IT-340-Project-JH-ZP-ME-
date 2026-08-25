import {
  Component,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mfa-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './mfa-setup.component.html',
  styleUrl: './mfa-setup.component.css'
})
export default class MfaSetupComponent {

  verifyForm: FormGroup;

  qrCode: string = '';
  secret: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  isLoading: boolean = false;
  setupStarted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.verifyForm = this.fb.group({
      token: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/)
        ]
      ]
    });
  }

  enableMfa(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.enableMfa().subscribe({
      next: (res: any) => {
        this.qrCode = res.qrCode || '';
        this.secret = res.secret || '';
        this.setupStarted = true;
        this.isLoading = false;
      },

      error: (err: any) => {
        console.error('MFA setup error:', err);

        this.errorMessage =
          err.error?.message ||
          'Unable to start MFA setup.';

        this.isLoading = false;
      }
    });
  }

  verifyMfa(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.verifyForm.invalid) {
      this.errorMessage =
        'Enter the 6-digit code from your authenticator app.';
      return;
    }

    const token =
      this.verifyForm.value.token;

    this.isLoading = true;

    this.authService.verifyMfaSetup(token).subscribe({
      next: () => {
        this.successMessage =
          'MFA has been enabled successfully.';

        this.isLoading = false;

        if (isPlatformBrowser(this.platformId)) {
          const storedUser =
            localStorage.getItem('user');

          if (storedUser) {
            const user =
              JSON.parse(storedUser);

            user.mfaEnabled = true;

            localStorage.setItem(
              'user',
              JSON.stringify(user)
            );
          }
        }

        setTimeout(() => {
          this.router.navigate(['/homepage-tv']);
        }, 1200);
      },

      error: (err: any) => {
        console.error(
          'MFA verification error:',
          err
        );

        this.errorMessage =
          err.error?.message ||
          'Invalid verification code. Please try again.';

        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/homepage-tv']);
  }
}
