import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../../services/auth.service';

@Component({
  selector: 'app-mfa-setup',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './mfa-setup.component.html',
  styleUrl: './mfa-setup.css'
})

export default class MfaSetupComponent {

  qrCode: string = '';
  secret: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  isLoading: boolean = false;
  setupStarted: boolean = false;

  verifyForm = new FormGroup({
    token: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    )
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================================
  // START MFA SETUP
  // ==========================================

  enableMfa(): void {

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.enableMfa().subscribe({

      next: (response: any) => {

        this.isLoading = false;

        this.qrCode = response?.qrCode || '';
        this.secret = response?.secret || '';

        this.setupStarted = true;

        this.cdr.detectChanges();
      },

      error: (err: any) => {

        this.isLoading = false;

        this.errorMessage =
          err.error?.message ||
          'Unable to start MFA setup.';

        this.cdr.detectChanges();
      }

    });
  }

  // ==========================================
  // VERIFY FIRST AUTHENTICATOR CODE
  // ==========================================

  verifyMfa(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.verifyForm.invalid) {

      this.verifyForm.markAllAsTouched();

      this.errorMessage =
        'Please enter the 6-digit code from your authenticator app.';

      return;
    }

    const code =
      this.verifyForm.value.token || '';

    this.isLoading = true;

    this.authService.verifyMfaSetup(code).subscribe({

      next: () => {

        this.isLoading = false;

        this.successMessage =
          'MFA has been enabled successfully.';

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/homepage-tv']);
        }, 1000);
      },

      error: (err: any) => {

        this.isLoading = false;

        this.errorMessage =
          err.error?.message ||
          'Invalid authentication code.';

        this.cdr.detectChanges();
      }

    });
  }

  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {
    this.router.navigate(['/homepage-tv']);
  }
}
