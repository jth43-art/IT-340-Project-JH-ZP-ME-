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
  selector: 'app-mfa-verify',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl:
    './mfa-verify.component.html',

  styleUrl:
    './mfa-verify.css'
})

export default class MfaVerifyComponent {

  errorMessage: string = '';
  isLoading: boolean = false;


  mfaForm = new FormGroup({

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
  // VERIFY MFA CODE
  // ==========================================

  onVerify(): void {

    this.errorMessage = '';


    if (this.mfaForm.invalid) {

      this.mfaForm.markAllAsTouched();

      this.errorMessage =
        'Please enter the 6-digit code from your authenticator app.';

      return;
    }


    const tempToken =
      this.authService
        .getMfaTempToken();


    if (!tempToken) {

      this.errorMessage =
        'Your MFA login session has expired. Please log in again.';

      return;
    }


    const code =
      this.mfaForm.value.token || '';


    this.isLoading = true;


    this.authService
      .verifyMfaLogin(
        tempToken,
        code
      )
      .subscribe({

        // ====================================
        // MFA SUCCESS
        // ====================================

        next: (response: any) => {

          this.isLoading = false;


          const role =
            response?.user?.role ||
            'user';


          const targetRoute =
            role === 'admin'
              ? '/admin-dashboard'
              : '/homepage-tv';


          this.router.navigate([
            targetRoute
          ]);

        },


        // ====================================
        // MFA FAILURE
        // ====================================

        error: (err: any) => {

          this.isLoading = false;


          if (
            err.status === 401
          ) {

            this.errorMessage =
              'Your MFA session expired. Please log in again.';

            this.authService
              .clearMfaTempToken();

          }

          else {

            this.errorMessage =
              err.error?.message ||
              'Invalid authentication code. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // ==========================================
  // RETURN TO LOGIN
  // ==========================================

  backToLogin(): void {

    this.authService
      .clearMfaTempToken();

    this.router.navigate([
      '/login'
    ]);

  }

}
